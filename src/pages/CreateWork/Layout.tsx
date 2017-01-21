import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister';
import { StepLicense, StepLicenseData } from './StepLicense/StepLicense';
import StepPublishAndReview from './StepPublishAndReview/StepPublishAndReview';

import './Layout.scss';

interface CreateWorkProps {
  userId: HexString;
}


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
            <StepLicense onSubmit={this.onStepLicenseSubmit.bind(this)} />
          </TabPanel>
          <TabPanel>
            <StepPublishAndReview/>
          </TabPanel>
        </Tabs>
      </section>

    )
  }

  private onStepRegisterSubmit(state: StepRegisterData) {
    console.log('onStepRegisterSubmit', state);
    this.setState({
      selectedStep: 1
    })
  }

  private onStepLicenseSubmit(state: StepLicenseData) {
    console.log('onStepLicenseSubmit', state);
    this.setState({
      selectedStep: 2
    })
  }
}
