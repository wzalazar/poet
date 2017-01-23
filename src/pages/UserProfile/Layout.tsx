import * as React from 'react';

import './Layout.scss';

export class ProfileLayout extends React.Component<any, undefined> {
  render() {
    return (
      <section className="user-edit">
        <div className="header">
          <h2>Edit profile</h2>
        </div>
        <form className="container">
          <div className="form-group">
            <div className="row">
              <label htmlFor="displayName" className="col-sm-3 col-form-label">Display name</label>
              <div className="col-sm-9">
                <input className="form-control" defaultValue={this.props.displayName} name="displayName"/>
              </div>
            </div>
            <div className="row">
              <label htmlFor="displayName" className="col-sm-3 col-form-label">Email</label>
              <div className="col-sm-9">
                <input className="form-control" defaultValue={this.props.email} name="email"/>
              </div>
            </div>
            <div className="row">
              <label htmlFor="displayName" className="col-sm-3 col-form-label">Image</label>
              <div className="col-sm-9">
                <input className="form-control" defaultValue={this.props.image} name="image"/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <label htmlFor="preferredCurrency" className="col-sm-3 col-form-label">Preferred currency</label>
              <div className="col-sm-9">
                <input className="form-control" defaultValue={this.props.email} name="preferredCurrency"/>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}
