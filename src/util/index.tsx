import React from "react";
import { connect } from "react-redux";
import { init } from "@rematch/core";
import * as _ from "lodash";

/**
 * @description:用以connect组件和model的装饰器函数
 */
type IConnectFunc = (payload: any) => any;
export const connectModel = (
  stateFunc?: IConnectFunc,
  dispatchFunc?: IConnectFunc
): any => {
  const mapState: any = stateFunc ? stateFunc : (state: any) => ({});
  const mapDispatch: any = dispatchFunc ? dispatchFunc : (dispatch: any) => { };
  return (WrapperComponent: any) => {
    class App extends React.Component<any, any> {
      public static displayName =
        "@connect" + WrapperComponent.displayName
          ? `(${WrapperComponent.displayName})`
          : "";
      public render() {
        return <WrapperComponent {...this.props} />;
      }
    }
    const connected: any = connect(
      mapState,
      mapDispatch
    )(App);

    return connected;
  };
};

/**
 * @description:获取store
 */
export const store: any = (() => {
  const context: any = (require as any).context("../models", true, /\.ts$/);
  const keys: string[] = context.keys();
  let models: any = {};
  keys.forEach((key: string) => {
    const name: string = key.replace(/^\.\//, "").replace(/\.ts$/, "");
    let mdl: any = context(key);
    mdl[name] = _.cloneDeep(mdl.default);
    delete mdl.default;
    models = {
      ...models,
      ...mdl
    };
  });

  const store = init({
    models
  });

  return store;
})();
