import * as React from 'react'

import { Configuration } from '../../configuration'
import { publicKeyToAddress } from '../../bitcoin/addressHelpers'
import { Work } from "../../Interfaces"

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister'
import { AttributeData } from './StepRegister/Attribute'
import { StepLicense, StepLicenseData } from './StepLicense/StepLicense'
import StepPublishAndReview from './StepPublishAndReview/StepPublishAndReview'
import { CurrentStep } from './CurrentStep'

import './Layout.scss'

export interface CreateWorkProps {
  readonly userPublicKey: string;
  readonly mode: 'create' | 'edit';
  readonly workId: string;
}

export interface CreateWorkActions {
  readonly createWorkRequested: (claims: any[]) => any // Actions.claimsSubmitRequested
}

interface CreateWorkLayoutState extends Partial<StepRegisterData> {
  readonly selectedStep?: number;
  readonly licenseData?: StepLicenseData;
}

export class CreateWorkLayout extends React.Component<CreateWorkProps & CreateWorkActions, CreateWorkLayoutState> {
  private readonly StepNames: ReadonlyArray<string> = ['Register a Work', 'Add a License', 'Preview and Publish']
  private readonly defaultAttributes: ReadonlyArray<AttributeData> = ['name', 'author', 'dateCreated', 'datePublished'].map(keyName => ({keyName, value: '', keyNameReadOnly: true}))

  constructor() {
    super(...arguments)
    this.state = {
      selectedStep: 0,
      mediaType: 'article',
      articleType: 'news-article',
      content: '',
      attributes: [...this.defaultAttributes]
    }
  }

  render() {
    return (
      <section className="container create-work">
        <header>
          <h1>{ this.StepNames[this.state.selectedStep] }</h1>
          <CurrentStep
            selectedStep={this.state.selectedStep}
            className="current-step"
          />
        </header>
        { this.state.selectedStep === 0 &&
          <StepRegister
            onSubmit={this.onStepRegisterSubmit}
            mediaType={this.state.mediaType}
            onMediaTypeChange={mediaType => this.setState({ mediaType })}
            articleType={this.state.articleType}
            onArticleTypeChange={articleType => this.setState({ articleType })}
            content={this.state.content}
            onContentChange={content => this.setState({ content })}
            attributes={this.state.attributes}
            onAttributesChange={attributes => this.setState({ attributes })}
          /> }
        { this.state.selectedStep === 1 && <StepLicense onSubmit={this.onStepLicenseSubmit} onSkip={this.onStepLicenseSkip} /> }
        { this.state.selectedStep === 2 &&
          <StepPublishAndReview
            onSubmit={this.onStepPublishAndReviewSubmit}
            workTitle={this.getAttributeValue('name')}
            contentHash={this.getAttributeValue('contentHash')}
            wordCount={this.getAttributeValue('wordCount')}
            authorName={this.getAttributeValue('author')}
            price={this.state.licenseData && this.state.licenseData.pricing.price}
            licenseType={this.state.licenseData && this.state.licenseData.licenseType}
            /> }
      </section>

    )
  }

  componentWillMount() {
    if (this.props.mode === 'edit') {
      this.loadWork()
    }
  }

  componentDidMount() {
    document.title = 'Register New Work'
  }

  componentWillUnmount() {
    document.title = 'Poet'
  }

  private onStepRegisterSubmit = () => {
    this.setState({
      selectedStep: 1
    })

    window.scrollTo(0, 0)
  }

  private onStepLicenseSubmit = (licenseData: StepLicenseData) => {
    this.setState({
      selectedStep: 2,
      licenseData
    })

    window.scrollTo(0, 0)
  }

  private onStepLicenseSkip: (() => void) = () => {
    this.setState({ selectedStep: 2 })
    window.scrollTo(0, 0)
  }

  private onStepPublishAndReviewSubmit = () => {
    const request = [{
      type: 'Work',
      attributes: [
        ...this.state.attributes.map(attribute => ({ key: attribute.keyName, value: attribute.value })),
        { key: 'mediaType', value: this.state.mediaType },
        { key: 'articleType', value: this.state.articleType },
        { key: 'content', value: this.state.content },
        { key: 'dateSubmitted', value: '' + new Date().getTime() }
      ]
    }]
    if (this.state.licenseData) {
      request.push({
        type: 'Offering',
        attributes: {
          'licenseType': this.state.licenseData.licenseType.id,
          'licenseDescription': this.state.licenseData.licenseType.description,
          'pricingFrequency': this.state.licenseData.pricing.frequency,
          'pricingPriceAmount': '' + this.state.licenseData.pricing.price.amount,
          'pricingPriceCurrency': this.state.licenseData.pricing.price.currency,
          'paymentAddress': publicKeyToAddress(this.props.userPublicKey),
          'amountInSatoshis': (this.state.licenseData.pricing.price.amount * 1e8).toFixed(0)
        } as any
      })
    }
    this.props.createWorkRequested(request)
  }

  private getAttributeValue(key: string): string {
    const attribute = this.state.attributes.find(_ => _.keyName === key)
    return attribute && attribute.value
  }

  private loadWork() {
    const objectToKeyNameValue = (_: Object) => Object.entries(_).map(([keyName, value]) => ({keyName, value}))

    /**
     * Attributes come from the API different to how we send them:
     * They are an object instead of a Key-Value array, don't have the optional and read-only fields, and aren't necessarily sorted correctly.
     * mergeDefaultAttributes takes the attributes object already converted to an array and ensures .
     */
    const mergeDefaultAttributes = (attributes: ReadonlyArray<AttributeData>) => {
      const defaultAttributes = this.defaultAttributes.map(defaultAttribute => {
        const attribute = attributes.find(_ => _.keyName === defaultAttribute.keyName)
        if (!attribute && !defaultAttribute.optional)
          console.warn(`The work we're editing is missing the ${defaultAttribute.keyName} attribute, which is mandatory.`)
        return { ...defaultAttribute, ...(attribute || {})}
      })

      const customAttributes = attributes
        .filter(attribute => !this.defaultAttributes.some(defaultAttribute => defaultAttribute.keyName === attribute.keyName))
        .filter(attribute => !['articleType', 'mediaType', 'content', 'dateSubmitted'].includes(attribute.keyName))

      return [...defaultAttributes, ...customAttributes]
    }

    fetch(Configuration.api.explorer + '/works/' + this.props.workId).then(_ => _.json()).then((_: any) => {
      this.setState({
        mediaType: _.attributes.mediaType,
        articleType: _.attributes.articleType,
        content: _.attributes.content,
        attributes: mergeDefaultAttributes(objectToKeyNameValue(_.attributes))
      })
    })
  }
}

