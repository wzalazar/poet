import * as React from 'react';

export interface RadioButtonGroupProps {
  className?: string;
  radioButtons: RadioButton[];
  onSelectionChange: (id: string) => void;
}

interface RadioButtonGroupState {
  selectedItem: number;
}

export class RadioButton {
  id: string;
  text: string;

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }
}

export class RadioButtonGroup extends React.Component<RadioButtonGroupProps, RadioButtonGroupState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedItem: 0
    };
  }

  private renderRadioButton(radioButton: RadioButton, index: number) {
    return (
      <label key={radioButton.id} className={'btn btn-primary ' + this.props.className + ' ' + (index === this.state.selectedItem ? 'active' : '' )}>
        <input type="radio" name="options" id={radioButton.id} onChange={this.onItemToggle.bind(this, index)} checked={index === this.state.selectedItem} /> {radioButton.text}
      </label>
    );
  }

  render() {
    return (
      <div className="btn-group" data-toggle="buttons">
        { this.props.radioButtons.map(this.renderRadioButton.bind(this)) }
      </div>
    )
  }

  private onItemToggle(index: number) {
    this.setState({
      selectedItem: index
    });
    this.props.onSelectionChange(this.props.radioButtons[index].id)
  }
}