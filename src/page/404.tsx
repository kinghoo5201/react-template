import React from 'react';

export default class App extends React.Component<any, any>{
  render() {
    console.log(this.props);
    return (
      <div>page not found(it is 404 page)</div>
    );
  }
}