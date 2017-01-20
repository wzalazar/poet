import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister';
import { StepLicense } from './StepLicense/StepLicense';
import { StepPublishAndReview } from './StepPublishAndReview/StepPublishAndReview';

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
            <StepLicense />
          </TabPanel>
          <TabPanel>
            <StepPublishAndReview/>
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
