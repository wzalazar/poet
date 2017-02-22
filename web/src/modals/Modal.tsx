import * as React from 'react'

const Overlays = require('react-overlays');

export interface ModalVisible {
  visible?: boolean
}

export interface ModalAction {
  cancelAction?: () => any
}

export interface ModalProps extends ModalVisible, ModalAction {}

abstract class Modal<T extends ModalProps, Q> extends React.Component<T, Q> {
  render() {
    if (!this.props.visible) {
      return <div/>
    }
    return (
      <Overlays.Modal
        aria-labelledby='modal-label'
        backdropClassName="backdrop"
        show={this.props.visible}
        onHide={this.props.cancelAction}
        className="modals-container"
      >
        { this.draw() }
      </Overlays.Modal>
    )
  }

  abstract draw(): any;
}

export default Modal;
