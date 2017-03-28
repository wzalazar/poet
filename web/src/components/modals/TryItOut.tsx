import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
const Overlays = require('react-overlays');

import { Images } from '../../images/Images';
import { Actions } from '../../actions/index';
import { PoetAppState } from '../../store/PoetAppState';
import { TryItOutSubmitAction } from '../../sagas/TryItOut';
import { Option, OptionGroup } from '../molecules/OptionGroup';
import { TextUpload, TextUploadButton } from '../molecules/TextUpload';

import './TryItOut.scss';

enum Tabs {
  Text, UploadFile
}

interface TryItOutProps {
  readonly visible: boolean;
  readonly hide: () => Action;
  readonly submit: (claims: any[]) => Action;
}

interface TryItOutState {
  readonly selectedTab?: Tabs;
  readonly text?: string;
  readonly fileContent?: string;
  readonly fileName?: string;
}

class TryItOutComponent extends React.Component<TryItOutProps, TryItOutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedTab: Tabs.Text
    }
  }

  render() {
    return (
      <Overlays.Modal
        className="modals-container"
        backdropClassName="backdrop"
        show={this.props.visible}
        onHide={this.props.hide}
      >
        <section className="modal-try-it-out">
          <h1>Try Out Poet</h1>
          <h2>This  explains  how your intellectual property is embedded in blockchain, it is also the quick and easiest way to timestamp if you dont need it attached to your profile  </h2>
          <OptionGroup selectedId={this.state.selectedTab} onOptionSelected={selectedTab => this.setState({ selectedTab })} className="option-group tab-option-group" >
            <Option id={Tabs.Text}>Text</Option>
            <Option id={Tabs.UploadFile}>Upload File</Option>
          </OptionGroup>
          { this.state.selectedTab === Tabs.Text && this.renderText() }
          { this.state.selectedTab === Tabs.UploadFile && this.renderUpload() }
          <p>
            Timestamping into the blockchain is a permanent action — it cannot be reverted or undone
          </p>
          <small>
            (this is how poet proves your ownership of intellectual property)
          </small>
          <button className="button-primary" onClick={this.onSubmit} disabled={!this.canSubmit()}>Timestamp to the blockchain at  03-28-17 at 12:30:93</button>
        </section>
      </Overlays.Modal>
    )
  }

  private renderText() {
    return <textarea
      value={this.state.text}
      onChange={(event: React.FormEvent<HTMLTextAreaElement>) => this.setState({ text: event.currentTarget.value })}
      placeholder="Start typing..."
    />;
  }

  private renderUpload() {
    return (
      <TextUpload className="upload" onChange={fileContent => this.setState({fileContent})} onFileNameChange={fileName => this.setState({fileName})} >
        <TextUploadButton>
          <img src={Images.Upload} />
          <h1>{this.state.fileName ? `${this.state.fileName} — Click to Replace File` : 'Click to Upload a File'}</h1>
          <h2>Accepted Formats:   .txt, .md</h2>
        </TextUploadButton>
      </TextUpload>
    )
  }

  private canSubmit = () => {
    if (this.state.selectedTab === Tabs.Text)
      return !!this.state.text;
    else
      return !!this.state.fileContent;
  };

  private onSubmit = () => {
    this.props.hide();
    this.props.submit([{
      type: 'Work',
      attributes: [
        { key: 'name', value: this.state.selectedTab === Tabs.UploadFile && this.state.fileName },
        { key: 'mediaType', value: 'article' },
        { key: 'articleType', value: 'news-article' },
        { key: 'content', value: this.state.selectedTab === Tabs.Text ? this.state.text : this.state.fileContent },
        { key: 'dateCreated', value: '' + new Date().getTime() },
        { key: 'datePublished', value: '' + new Date().getTime() },
        { key: 'dateSubmitted', value: '' + new Date().getTime() }
      ]
    }])
  };
}

const mapStateToProps = (state: PoetAppState) => ({
  visible: state.modals.tryItOut
});

const mapDispatch: {
  readonly hide: () => Action;
  readonly submit: (workClaim: any) => TryItOutSubmitAction;
} = {
  hide: () => ({ type: Actions.Modals.TryItOut.Hide }),
  submit: (workClaim: any) => ({ type: Actions.Modals.TryItOut.Submit, workClaim })
};

export const TryItOut = connect(mapStateToProps, mapDispatch)(TryItOutComponent);