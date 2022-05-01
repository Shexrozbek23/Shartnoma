import React, { Component } from 'react';
import WithAxios from '../../../hocs/WithAxios';

const PageAlertContext = React.createContext();

export class PageAlertProvider extends Component {
  constructor() {
    super();
    this.state = {
      alert: null,
    };
  }

  setAlert = (message, type) => {
    const NewAlert = { message, type };
    this.setState({ alert: NewAlert });
  };

  closeAlert = () => {
    this.setState({ alert: null });
  };

  render() {
    return (
      <PageAlertContext.Provider
        value={{
          alert: this.state.alert,
          closeAlert: this.closeAlert,
          setAlert: this.setAlert,
        }}
      >
        <WithAxios>{this.props.children}</WithAxios>
      </PageAlertContext.Provider>
    );
  }
}

export default PageAlertContext;
