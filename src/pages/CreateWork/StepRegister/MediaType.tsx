import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { RadioButtonGroup, RadioButton } from '../../../components/RadioButtonGroup';

export interface MediaTypeProps {
  className?: string;
  onChange?: (selectedId: string) => void;
}

const radioButtons = [
  new RadioButton('news-article', 'News Article'),
  new RadioButton('report', 'Report'),
  new RadioButton('scholarly', 'Scholarly'),
  new RadioButton('technical', 'Technical')
];

const radioButtonsAudio = [
  new RadioButton('song', 'Song'),
  new RadioButton('read-poem', 'Read Poem'),
  new RadioButton('audiobook', 'Audiobook')
];

export class MediaType extends React.Component<MediaTypeProps, any> {
  constructor() {
    super(...arguments);
    this.state = {
      subType: 'news-article'
    }
  }

  render() {
    return (
      <section className={this.props.className}>
        <h2>Media Type</h2>
        <Tabs>
          <TabList>
            <Tab>Article</Tab>
            {/*<Tab>Audio</Tab>*/}
            {/*<Tab>Video</Tab>*/}
            {/*<Tab>Image</Tab>*/}
          </TabList>
          <TabPanel>
            <RadioButtonGroup radioButtons={radioButtons} onSelectionChange={this.onChange.bind(this)} />
          </TabPanel>
          {/*<TabPanel>*/}
            {/*<RadioButtonGroup radioButtons={radioButtonsAudio} onSelectionChange={this.props.onChange} />*/}
          {/*</TabPanel>*/}
          {/*<TabPanel>*/}
          {/**/}
          {/*</TabPanel>*/}
          {/*<TabPanel>*/}
          {/**/}
          {/*</TabPanel>*/}
        </Tabs>
      </section>
    )
  }

  private onChange(subType: string) {
    this.setState({
      subType
    });
  }
}