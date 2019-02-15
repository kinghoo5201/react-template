import React from "react";
import { connect } from "react-redux";
import { init } from "@rematch/core";
import * as _ from "lodash";
import { resolve } from "dns";

export const isDev = window.location.hostname === 'localhost';

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

export interface IParam {
  url: string;
  method?: string;
  body?: any;
  header?: any;
}

export interface IRes {
  flag: boolean;
  data: any;
}
type IResolveRes = (res: IRes) => void;
export const baseAjax = (cfg: string | IParam) => {
  return new Promise((resolve: IResolveRes) => {
    let opt: IParam = {
      url: '',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      // body: '{}'
    };
    if (_.isString(cfg)) {
      opt.url = cfg;
    } else {
      opt = {
        ...opt,
        ...cfg,
      }
    }
    if (!_.isString(opt.body)) {
      opt.body = JSON.stringify(opt.body);
    }
    return fetch(opt.url, {
      method: opt.method,
      headers: opt.header,
      body: opt.body
    })
      .then((res: any) => {
        if (res.status >= 400) {
          window.console.warn('net error::', res.status);
          return resolve({
            flag: false,
            data: null,
          });
        }
        return res.json();
      })
      .then((json: any) => {
        if (!_.isNil(json.flag) && !_.isNil(json.data)) {
          return resolve(json);
        }
        return resolve({
          flag: true,
          data: json
        })
      })
      .catch((e: any) => {
        window.console.warn('error::', e);
        return resolve({
          flag: false,
          data: null,
        })
      })
  });
}

export const get = (cfg: string | IParam) => {
  return new Promise((resolve: IResolveRes) => {
    let url: string = _.isString(cfg) ? cfg : cfg.url;
    if (!_.isString(cfg) && cfg.body) {
      let tempPayload: any = {};
      if (_.isString(cfg.body)) {
        tempPayload = JSON.stringify(cfg.body);
      } else {
        tempPayload = cfg.body;
      }
      const query: string[] = [];
      Object.keys(tempPayload).forEach((k: string) => {
        query.push(`${k}=${tempPayload[k]}`);
      });
      const flag: boolean = /\?/.test(url);
      url = `${url}${flag ? '&' : '?'}${query.join('&')}`;
    }
    const opt: IParam = {
      url,
      ...(_.isString(cfg) ? {} : cfg),
      method: 'GET',
    };
    delete opt.body;
    return baseAjax(opt).then((res: IRes) => {
      return resolve(res);
    })
  });
}

export const post = (cfg: string | IParam) => {
  return new Promise((resolve: IResolveRes) => {
    let url: string = _.isString(cfg) ? cfg : cfg.url;
    const opt: IParam = {
      url,
      body: '{}',
      ...(_.isString(cfg) ? {} : cfg),
      method: 'POST',
    };
    return baseAjax(opt).then((res: IRes) => {
      return resolve(res);
    })
  });
}