export type HexString = string;

export interface KeyValue {
  readonly key: string;
  readonly value: string;
}

export interface Price {
  readonly amount?: number;
  readonly currency?: string;
}

export interface Pricing {
  readonly price?: Price;
  readonly frequency?: PricingFrequency;
}

export type PricingFrequency = 'oneTime';

export class LicenseType {
  readonly id: string;
  readonly name: string;
  readonly description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export const LicenseTypes: ReadonlyArray<LicenseType> = [
  new LicenseType('license-to-publish', 'License to Publish', 'Publication rights are extended to anyone who provides proof of payment on the Bitcoin blockchain for the amount expressed by the owner of this creative work.'),
  new LicenseType('for-sale', 'For Sale', 'The title of ownership will be transferred to anyone who provides proof of payment on the Bitcoin blockchain for the amount established.')
];

export interface ClassNameProps {
  readonly className?: string;
  readonly classNames?: ReadonlyArray<string>;
}

export interface UrlObject {
  readonly url: string;
  readonly query: {
    readonly [index: string]: string | number;
  }
}

export function isUrlObject(a: any): a is UrlObject {
  return !!a.url;
}

export function urlObjectQueryParams(urlObject: UrlObject): string {
  return urlObject.query ?
    Object.keys(urlObject.query).filter(key => urlObject.query[key]).map(key => `${key}=${urlObject.query[key]}`).join('&') : '';
}

export function urlObjectToUrl(urlObject: UrlObject): string {
  const queryParams = urlObjectQueryParams(urlObject);
  return urlObject.url + '?' + queryParams;
}