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

```tsx
export default{
  state:{
    test:'ccc'
  },
  reducers:{},
  effects:{},
}
```
file's name will be store's name

```tsx
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
## 20190225 update

if you want to use hash Router , just replace

```ts
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
```

to 

```ts
import { Switch, Route, HashRouter as Router } from "react-router-dom";
```

then you can use HashRouter to adapt to gitpage or giteepage,when use spa.

also when using Link at HashRouter will report an error,but it dose not matter.so just do it!


## 20190227 update

if you want to declare module or some unknown type , you can create a file named ```./src/types.d.ts``` to resolve it
