import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';

import { RadioButton, RadioButtonGroup } from '../../components/RadioButtonGroup';
import { Checkbox } from '../../components/Checkbox';

import { MediaType } from './MediaType';
import { Fields } from './Fields';
import { Content } from './Content';

import './Layout.scss';

interface CreateWorkProps {
  userId: HexString;
}

const licenseTypes = [
  new RadioButton('attribution-only', 'Attribution Only'),
  new RadioButton('pay', 'Pay'),
  new RadioButton('one-off', 'One Off'),
  new RadioButton('pay-to-publish', 'Pay to Publish')
];

export class CreateWorkLayout extends React.Component<CreateWorkProps, undefined> {
  private selectedStep: number = 0;

  render() {
    return (
      <section className="create-work">
        <Tabs selectedIndex={this.selectedStep}>
          <TabList className="tab-list">
            <Tab>Register</Tab>
            <Tab>License</Tab>
            <Tab>Review &amp; Publish</Tab>
          </TabList>
          <TabPanel>
            <section className="step-1-register">
              <h2>Register a New Work</h2>
              <MediaType className="media-type mb-3" onChange={this.onMediaTypeSelectionChange.bind(this)}/>
              <Fields className="fields"/>
              <Content/>
            </section>
          </TabPanel>
          <TabPanel>
            <section className="step-2-license">
              <h2>Add a License</h2>
              <div className="row">
                <div className="col-sm-6">
                  <h3>License</h3>
                  <RadioButtonGroup radioButtons={licenseTypes} onSelectionChange={console.log} className="mb-3" />
                  <h3>Pricing</h3>
                  <div className="row">
                    <div className="col-sm-4">Frequency</div>
                    <div className="col-sm-8">
                      <Checkbox text="One Time" />
                      <Checkbox text="Per Page View" />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4">Price</div>
                    <div className="col-sm-8">
                      <div className="input-group">
                        <span className="input-group-addon">$</span>
                        <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                        <span className="input-group-addon">.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div><h4>Preview</h4></div>
                  <div>
                    <div>Attribution License</div>
                    <div>Lorem ipsum blah blah blah</div>
                  </div>
                </div>
              </div>
            </section>
          </TabPanel>
          <TabPanel>
            <section className="step-3-publish">
              <h2>Review &amp; Publish</h2>
              <hr/>
            </section>
          </TabPanel>
        </Tabs>
        <nav className="mt-3">
          { this.selectedStep > 0 && <button className="btn btn-primary" onClick={this.onPrevious.bind(this)}>Previous</button> }
          { this.selectedStep < 2 && <button className="btn btn-primary" onClick={this.onNext.bind(this)}>Next</button> }
        </nav>
      </section>

    )
  }

  private onNext() {
    this.selectedStep++; // coding horror, should use either the component's state or the global redux state
    this.forceUpdate();
  }

  private onPrevious() {
    this.selectedStep--; // coding horror, should use either the component's state or the global redux state
    this.forceUpdate();
  }

  private onMediaTypeSelectionChange(id: string) {
    console.log('onMediaTypeSelectionChange', id);
  }
}
