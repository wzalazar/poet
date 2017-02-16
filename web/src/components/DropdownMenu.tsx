import * as React from 'react';

export interface DropdownMenuProps {
  options: string[];
  optionSelected: (option: string) => void;
}

export interface DropdownState {
  open: boolean
};

export class DropdownMenu extends React.Component<DropdownMenuProps, DropdownState> {
  private open: boolean;

  constructor() {
    super(...arguments);
    this.state = {
      open: false
    };
  }

  toggle() {
    this.setState({ open: !this.state.open })
  }

  hide() {
    this.setState({ open: false })
  }

  selected(option: string) {
    this.hide()
    this.props.optionSelected(option)
  }

  render() {
    return (
      <div className={ 'dropdown ' + (this.state.open ? 'show' : '') }>
        <button onClick={this.toggle.bind(this)}
          className="btn btn-sm btn-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
        >
          { this.props.children }
        </button>
        <div className="dropdown-menu">
          { this.props.options.map(option =>
              <a key={option}
                onClick={this.selected.bind(this, option)}
                className="dropdown-item"
                href="#">
                {option}
              </a>
            )
          }
        </div>
      </div>
    );
  }
}