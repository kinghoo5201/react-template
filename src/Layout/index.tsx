/**
 * @description:in this page you can edit common layout 
 */
import React from 'react';

export default class Layout extends React.Component<any, any>{
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}