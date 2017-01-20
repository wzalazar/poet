import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';

import { RadioButton, RadioButtonGroup } from '../../components/RadioButtonGroup';

import { Pricing } from './Pricing';
import { LicensePreview } from './LicensePreview';

import './Layout.scss';
import { TermsOfUse } from './TermsOfUse';
import { Preview } from './Preview';
import { StepRegister, StepRegisterData } from './StepRegister/StepRegister';

interface CreateWorkProps {
  userId: HexString;
}

const licenseTypes = [
  new RadioButton('attribution-only', 'Attribution Only'),
  new RadioButton('pay', 'Pay'),
  new RadioButton('one-off', 'One Off'),
  new RadioButton('pay-to-publish', 'Pay to Publish')
];

interface CreateWorkLayoutState {
  selectedStep: number;
}

export class CreateWorkLayout extends React.Component<CreateWorkProps, CreateWorkLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedStep: 0
    }
  }

  render() {
    return (
      <section className="create-work">
        <Tabs selectedIndex={this.state.selectedStep}>
          <TabList className="tab-list">
            <Tab>Register</Tab>
            <Tab>License</Tab>
            <Tab>Review &amp; Publish</Tab>
          </TabList>
          <TabPanel>
            <StepRegister onSubmit={this.onStepRegisterSubmit.bind(this)} />
          </TabPanel>
          <TabPanel>
            <section className="step-2-license">
              <h2>Add a License</h2>
              <div className="row">
                <div className="col-sm-6">
                  <h3>License</h3>
                  <RadioButtonGroup radioButtons={licenseTypes} className="mb-3" onSelectionChange={console.log} />
                  <Pricing />
                </div>
                <LicensePreview className="col-sm-6"/>
              </div>
            </section>
          </TabPanel>
          <TabPanel>
            <section className="step-3-publish">
              <h2>Review &amp; Publish</h2>
              <div className="row">
                <div className="col-sm-7">
                  <TermsOfUse className="mb-2"/>
                  <button className="btn btn-primary">Timestamp to the blockchain at {new Date().toISOString()}</button>
                </div>
                <Preview className="col-sm-5 mb-2 border-1 p-1" />
              </div>
            </section>
          </TabPanel>
        </Tabs>
        <nav className="mt-3">
          { this.state.selectedStep > 0 && <button className="btn btn-secondary" onClick={this.onPrevious.bind(this)}>Previous</button> }
          { this.state.selectedStep < 2 && <button className="btn btn-primary" onClick={this.onNext.bind(this)}>Next</button> }
        </nav>
      </section>

    )
  }

  private onNext() {
    this.setState({
      selectedStep: this.state.selectedStep + 1
    })
  }

  private onPrevious() {
    this.setState({
      selectedStep: this.state.selectedStep - 1
    })
  }

  private onStepRegisterSubmit(state: StepRegisterData) {
    console.log('onStepRegisterSubmit', state);
    this.setState({
      selectedStep: 1
    })
  }
}
