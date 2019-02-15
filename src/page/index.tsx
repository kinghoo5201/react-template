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
                    use browser router & it can use file's dir path to site path;
                    root path from ./src/page<br />
                    <br />
                    ./<br />
                    --./src<br />
                    ----./src/page<br />
                    ------./src/page/index.tsx<br />
                    ------./src/page/404.tsx<br />
                    --------./src/page/test<br />
                    ----------./src/page/test/index.tsx<br />
                    <br />
                    page dir is ./src/page<br />
                    <br />
                    indexPage :localhost:3000=>./src/page/index.tsx<br />
                    <br />
                    test:localhost:3000/test=>./src/page/test/index.tsx<br />
                    <br />
                    if there has 404.tsx,<br />
                    the 404.tsx will redirect to ./src/page/404.tsx
            </div>
        );
    }
}