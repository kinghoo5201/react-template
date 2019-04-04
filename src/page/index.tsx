import React from 'react';
import { connectModel } from '../util';

@connectModel(
    (state: any) => ({
        indexData: state.index
    }),
    (dispatch: any) => ({

    })
)
export default class App extends React.Component<any, any>{
    public render() {
        console.log(this.props);
        return (
            <div>
                welcome to react-template
            </div>
        );
    }
}