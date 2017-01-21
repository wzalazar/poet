import * as React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister'
import { StepLicense, StepLicenseData } from './StepLicense/StepLicense'
import StepPublishAndReview from './StepPublishAndReview/StepPublishAndReview'

import './Layout.scss'

interface CreateWorkProps {
  createWorkRequested: (claims: any[]) => any // Actions.createWorkRequested
}

interface CreateWorkLayoutState {
  selectedStep: number;
  licenseData?: StepLicenseData;
  workData?: StepRegisterData;
}

export default class CreateWorkLayout extends React.Component<CreateWorkProps, CreateWorkLayoutState> {

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
            <StepPublishAndReview onSubmit={this.submitWork.bind(this)} />
          </TabPanel>
        </Tabs>
      </section>

    )
  }

  private onStepRegisterSubmit(workData: StepRegisterData) {
    console.log('onStepRegisterSubmit', workData);
    this.setState({
      selectedStep: 1,
      workData: workData
    })
  }

  private onStepLicenseSubmit(licenseData: StepLicenseData) {
    console.log('onStepLicenseSubmit', licenseData);
    this.setState({
      selectedStep: 2,
      licenseData: licenseData
    })
  }

  private submitWork() {
    this.props.createWorkRequested([
      {
        type: 'Work',
        attributes: this.state.workData
      },
      {
        type: 'Offering',
        attributes: {
          'offeringType': this.state.licenseData.licenseType,
          'offeringInfo': JSON.stringify(this.state.licenseData.pricing)
        }
      }
    ])
  }
}

