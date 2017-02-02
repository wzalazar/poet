import * as React from 'react';

import { RadioButton, RadioButtonGroup } from '../../components/RadioButtonGroup';

export class PortfolioWorksFilters extends React.Component<any, undefined> {
  private readonly radioButtons: ReadonlyArray<RadioButton> = [
    new RadioButton('all', 'News All'),
    new RadioButton('articles', 'Articles'),
    new RadioButton('images', 'Images'),
    new RadioButton('audio', 'Audio'),
    new RadioButton('video', 'Video')
  ];

  render() {
    return (
      <RadioButtonGroup radioButtons={this.radioButtons}/>
    )
  }

}
