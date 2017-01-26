import * as React from 'react';

export interface RadioButtonGroupProps {
  readonly className?: string;
  readonly radioButtons: ReadonlyArray<RadioButton>;
  readonly onSelectionChange?: (id: string, text: string) => void;
}

interface RadioButtonGroupState {
  readonly selectedIndex: number;
}

export class RadioButton {
  readonly id: string;
  readonly text: string;

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }
}

export class RadioButtonGroup extends React.Component<RadioButtonGroupProps, RadioButtonGroupState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedIndex: 0
    };
  }

  private renderRadioButton(radioButton: RadioButton, index: number) {
    return (
      <label key={radioButton.id} className={'btn btn-primary ' + this.props.className + ' ' + (index === this.state.selectedIndex ? 'active' : '' )}>
        <input type="radio" name="options" id={radioButton.id} onChange={this.onItemToggle.bind(this, index)} checked={index === this.state.selectedIndex} /> {radioButton.text}
      </label>
    );
  }

  render() {
    return (
      <section className="btn-group btn-group-sm" data-toggle="buttons">
        { this.props.radioButtons.map(this.renderRadioButton.bind(this)) }
      </section>
    )
  }

  private onItemToggle(index: number) {
    this.setState({
      selectedIndex: index
    });
    this.props.onSelectionChange && this.props.onSelectionChange(this.props.radioButtons[index].id, this.props.radioButtons[index].text)
  }

  public getSelectedItem() {
    return this.props.radioButtons[this.state.selectedIndex];
  }
}