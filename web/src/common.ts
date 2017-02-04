export type HexString = string;

export interface Price {
  readonly amount: number;
  readonly currency: string;
}

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
  new LicenseType('attribution-only', 'Attribution Only', 'Lorem Ipsum Attribution Only'),
  new LicenseType('pay', 'Pay', 'Lorem Ipsum Pay'),
  new LicenseType('one-off', 'One Off', 'Lorem Ipsum One Off'),
  new LicenseType('pay-to-publish', 'Pay to Publish', 'Lorem Ipsum Pay to Publish')
];

export interface ClassNameProps {
  readonly className?: string;
  readonly classNames?: ReadonlyArray<string>;
}