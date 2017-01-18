import * as React from 'react';

export interface DropdownMenuProps {
  options: string[];
  optionSelected: (option: string) => void;
}

export class DropdownMenu extends React.Component<DropdownMenuProps, undefined> {
  private open: boolean;

  constructor() {
    super(...arguments);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  hide() {
    this.open = false;
    this.forceUpdate();
    document.removeEventListener('click', this.hide);
  }

  show() {
    this.open = true;
    this.forceUpdate();
    document.addEventListener('click', this.hide);
  }

  render() {
    return (
      <div className={ 'dropdown ' + (this.open ? 'show' : '') }>
        <button onClick={this.show.bind(this)} className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          { this.props.children }
        </button>
        <div className="dropdown-menu " aria-labelledby="dropdownMenuButton">
          { this.props.options.map(option => <a key={option} onClick={this.props.optionSelected.bind(null, option)} className="dropdown-item" href="#">{option}</a>)}
        </div>
      </div>
    );
  }
}