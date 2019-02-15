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
    render() {
        console.log(this.props);
        return (
            <div>
                <pre>
                    use browser router & it can use file's dir path to site path;
                    root path from ./src/page

                    ./
                    --./src
                    ----./src/page
                    ------./src/page/index.tsx
                    ------./src/page/404.tsx
                    --------./src/page/test
                    ----------./src/page/test/index.tsx

                    page dir is ./src/page

                    indexPage :localhost:3000=>./src/page/index.tsx

                    test:localhost:3000/test=>./src/page/test/index.tsx

                    if there has 404.tsx,
                    the 404.tsx will redirect to ./src/page/404.tsx
                </pre>
            </div>
        );
    }
}