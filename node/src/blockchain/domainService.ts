import "reflect-metadata";
import {Repository} from "typeorm";
import Fields from "./fields";
import {Claim as PureClaim} from "../claim";
import Profile from "./orm/domain/profile";
import License from "./orm/domain/license";
import Offering from "./orm/domain/offering";
import Title from "./orm/domain/title";
import Work from "./orm/domain/work";
import Attribute from "./orm/attribute";
import {ClaimService} from "./claimService";
import CertificationService from "./certificatonService";
import {default as listenRules} from "./rules/listen";
import {BlockMetadata} from "../events";
import { EventService } from './eventService';
import Event from './orm/events/events';
import { EventType } from './orm/events/events';
import NotificationRead from './orm/events/notification';
import Normalized from './orm/bitcoin/normalized';

export default class DomainService extends ClaimService {

  public certificationService: CertificationService;
  private eventService: EventService;

  constructor() {
    super()
    this.certificationService = new CertificationService(this)
    this.eventService = new EventService(this.db)
  }

  async createOrUpdateClaimInfo(claim: PureClaim, txInfo: BlockMetadata) {
    const storedClaim = await super.createOrUpdateClaimInfo(claim, txInfo)
    try {
      await Promise.all(listenRules[claim.type].map(
        rule => rule.hook(this, claim, txInfo)
      ))
    } catch (error) {
      console.log('Error storing claim', error)
    }
    return storedClaim
  }

  async getOwnerPublicKey(referenceId: string) {
    const title = await this.titleRepository.findOne({ reference: referenceId })
    if (!title) {
      return null
    }
    const claim = await this.getClaim(title.id)
    if (claim) {
      return claim.attributes[Fields.OWNER_KEY]
    } else {
      throw new Error('Claim not found! ID:' + title.id)
    }
  }

  async getWork(id: string) {
    return await this.workRepository.createQueryBuilder('work')
      .leftJoinAndMapOne('work.title', 'work.title', 'title')
      .leftJoinAndMapOne('work.owner', 'work.owner', 'owner')
      .leftJoinAndMapOne('work.author', 'work.author', 'author')
      .leftJoinAndMapMany('work.licenses', 'work.licenses', 'licenses')
      .leftJoinAndMapMany('work.offerings', 'work.offerings', 'offerings')
      .leftJoinAndMapMany('work.publishers', 'work.publishers', 'publishers')
      .where('work.id=:id')
      .setParameters({id})
      .getOne()
  }

  async getWorkFull(id: string) {
    const work = await this.workRepository.createQueryBuilder('work')
      .leftJoinAndMapOne('work.title', 'work.title', 'title')
      .leftJoinAndMapOne('work.owner', 'work.owner', 'owner')
      .leftJoinAndMapOne('work.author', 'work.author', 'author')
      .leftJoinAndMapMany('work.licenses', 'work.licenses', 'licenses')
      .leftJoinAndMapMany('work.offerings', 'work.offerings', 'offerings')
      .leftJoinAndMapMany('work.publishers', 'work.publishers', 'publishers')
      .where('work.id=:id')
      .setParameters({ id })
      .getOne()
    work.claimInfo = await this.getClaimInfo(id)
    return await this.augmentWork(work)
  }

  async getProfile(id: string) {
    const profile = await this.profileRepository.createQueryBuilder('profile')
      .leftJoinAndMapMany('profile.licenses', 'profile.licenses', 'license')
      .leftJoinAndMapMany('profile.hasLicensesFor', 'profile.hasLicensesFor', 'hasLicensesFor')
      .leftJoinAndMapMany('profile.authoredWorks', 'profile.authoredWorks', 'authoredWorks')
      .leftJoinAndMapMany('profile.ownedWorks', 'profile.ownedWorks', 'ownedWorks')
      .where('profile.id=:id')
      .setParameters({ id })
      .getOne()
    return profile
  }

  async getProfileFull(id: string) {
    const profile = await this.getProfile(id)
    if (profile) {
      return await this.augmentProfile(profile)
    }
    return null
  }

  async getLicenseFull(id: string) {
    const license = await this.licenseRepository.findOneById(id)
    if (!license) {
      return null
    }
    const claim = await this.getClaim(id)
    license.reference = await this.getWork(claim.attributes[Fields.REFERENCE])
    license.referenceOffering = await this.getOffering(claim.attributes[Fields.REFERENCE_OFFERING])
    license.licenseHolder = await this.getProfile(claim.attributes[Fields.LICENSE_HOLDER])
    return { ...claim, ...license }
  }

  async augmentWork(work: Work) {
    const ids = [work.id]
    if (work.title) ids.push(work.title.id)
    if (work.owner) ids.push(work.owner.id)
    if (work.author) ids.push(work.author.id)
    if (work.licenses) for (let license of work.licenses) ids.push(license.id)
    if (work.offerings) for (let offering of work.offerings) ids.push(offering.id)
    if (work.publishers) for (let publisher of work.publishers) ids.push(publisher.id)
    const attributeResults = await this.attributeRepository.createQueryBuilder('attribute')
      .where('attribute.claim IN (:ids)')
      .leftJoinAndMapOne('attribute.claim', 'attribute.claim', 'claim')
      .setParameters({ ids })
      .getMany()
    const mapAttributes: { [key: string]: { [key2: string]: string } } = {}
    for (let attribute of attributeResults) {
      const id = attribute.claim.id
      mapAttributes[id] = mapAttributes[id] || {}
      mapAttributes[id][attribute.key] = attribute.value
    }
    work.attributes = mapAttributes[work.id]
    if (work.title) work.title.attributes = mapAttributes[work.title.id]
    if (work.owner) work.owner.attributes = mapAttributes[work.owner.id]
    if (work.author) work.author.attributes = mapAttributes[work.author.id]
    if (work.licenses) for (let license of work.licenses) license.attributes = mapAttributes[license.id]
    if (work.offerings) for (let offering of work.offerings) offering.attributes = mapAttributes[offering.id]
    if (work.publishers) for (let publisher of work.publishers) publisher.attributes = mapAttributes[publisher.id]
    return work
  }

  async augmentProfile(profile: Profile) {
    const ids = [profile.claim]
    if (profile.licenses) for (let license of profile.licenses) ids.push(license.id)
    if (profile.hasLicensesFor) for (let license of profile.hasLicensesFor) ids.push(license.id)
    if (profile.authoredWorks) for (let work of profile.authoredWorks) ids.push(work.id)
    if (profile.ownedWorks) for (let work of profile.ownedWorks) ids.push(work.id)
    const attributeResults = await this.attributeRepository.createQueryBuilder('attribute')
      .where('attribute.claim IN (:ids)')
      .leftJoinAndMapOne('attribute.claim', 'attribute.claim', 'claim')
      .setParameters({ ids })
      .getMany()
    const mapAttributes: { [key: string]: { [key2: string]: string } } = {}
    for (let attribute of attributeResults) {
      const id = attribute.claim.id
      mapAttributes[id] = mapAttributes[id] || {}
      mapAttributes[id][attribute.key] = attribute.value
    }
    profile.attributes = mapAttributes[profile.claim]
    if (profile.licenses) for (let license of profile.licenses) license.attributes = mapAttributes[license.id]
    if (profile.hasLicensesFor) for (let license of profile.hasLicensesFor) license.attributes = mapAttributes[license.id]
    if (profile.authoredWorks) for (let work of profile.authoredWorks) work.attributes = mapAttributes[work.id]
    if (profile.ownedWorks) for (let work of profile.ownedWorks) work.attributes = mapAttributes[work.id]
    return profile
  }

  async getOffering(referenceOfferingId: string) {
    const claim = await this.getClaim(referenceOfferingId)
    const offering = await this.offeringRepository.findOneById(referenceOfferingId)
    return { ...claim, ...offering }
  }

  async findSimilarProfiles(name: string) {
    return await this.profileRepository.createQueryBuilder('profile')
      .where(`(profile.displayName LIKE :name)
         OR (profile.id LIKE :name)`)
      .setParameters({ name: '%' + name + '%' })
      .getMany()
  }

  get workRepository(): Repository<Work> {
    return this.db.getRepository(Work)
  }

  get profileRepository(): Repository<Profile> {
    return this.db.getRepository(Profile)
  }

  get licenseRepository(): Repository<License> {
    return this.db.getRepository(License)
  }

  get offeringRepository(): Repository<Offering> {
    return this.db.getRepository(Offering)
  }

  get titleRepository(): Repository<Title> {
    return this.db.getRepository(Title)
  }

  get attributeRepository(): Repository<Attribute> {
    return this.db.getRepository(Attribute)
  }

  get eventRepository(): Repository<Event> {
    return this.db.getRepository(Event)
  }

  get notificationRepository(): Repository<NotificationRead> {
    return this.db.getRepository(NotificationRead)
  }

  get normalizedRepository(): Repository<Normalized> {
    return this.db.getRepository(Normalized)
  }

  storeWork(work: {id: string; author?: Profile, displayName?: string}) {
    return this.workRepository.persist(this.workRepository.create(work))
  }

  async saveEvent(id: string, type: EventType, work: Work, actor: Profile, payload?: string, extra?: any) {
    try {
      const query: any = {
        type,
        claimReference: id
      }
      if (work) {
        query.workId = work.id
      }
      if (actor) {
        query.actorId = actor.id
      }
      const existent = await this.eventRepository.findOne(query)
      if (existent) {
        return
      }
      const event = await this.eventRepository.persist(this.eventRepository.create({
        type,
        timestamp: new Date().getTime(),
        claimReference: id,
        workId: work && work.id,
        workDisplayName: work && work.displayName,
        actorId: actor && actor.id,
        actorDisplayName: actor && actor.displayName,
        payload
      }))
      if (event.type === EventType.TITLE_ASSIGNED) {
        await this.notificationRepository.persist((this.notificationRepository.create({
          event: event,
          read: false,
          user: event.actorId
        })))
      }
      if (event.type === EventType.LICENSE_BOUGHT) {
        await this.notificationRepository.persist((this.notificationRepository.create({
          event: event,
          read: false,
          user: extra.id
        })))
      }
      return event
    } catch (error) {
      console.log('Could not save event', error)
    }
  }

  async getTxId(ntxId: string): Promise<string> {
    const confirmed = await this.normalizedRepository.findOne({ ntxId, confirmed: true })
    if (confirmed) {
      return confirmed.txId
    }
    const unconfirmed = await this.normalizedRepository.findOne({ ntxId })
    if (unconfirmed) {
      return unconfirmed.txId
    }
    return ''
  }

  async getOrCreateProfile(id: string) {
    const profile = await this.profileRepository.findOneById(id)
    if (profile) {
      return profile
    }
    return await this.profileRepository.persist(
      this.profileRepository.create({ id })
    )
  }

  async linkClaims(from: string, to: string) {
    return await this.linkRepository.persist(this.linkRepository.create({ from, to }))

  }
}
