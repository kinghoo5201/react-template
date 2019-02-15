## logs

#19-02-15 init with antd & ts 

use browser router & it can use file's dir path to site path;
root path from ./src/page

## file dir to path

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

the page data store control is at ./src/models
the model's content is :

```ts
export default{
  state:{
    test:'ccc'
  },
  reducers:{},
  effects:{},
}
```
file's name will be store's name

```ts
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
               index
            </div>
        );
    }
}
```

so the props:
```js
{
  // some attr
  indexData:{
    test:'ccc'
  }
}
```