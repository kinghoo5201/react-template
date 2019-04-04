import React from "react";
import { connect } from "react-redux";
import { init } from "@rematch/core";
import * as _ from "lodash";

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
                "@connect" + (WrapperComponent.displayName
                    ? `(${WrapperComponent.displayName})`
                    : "");
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

// ajax函数参数的形状
export interface IOpt {
    // ajax函数的接口规定
    method?: string;
    data?: any; // 可以是字符串，也可以是对象
    mode?: string;
    credentials?: string;
}
/**
 * @description ajax函数
 * @param url 请求接口
 * @param opt 请求参数
 */
export const ajax = (url: string, opt: IOpt = {}) => {
    return new Promise((resolve: any) => {
        const fetchSet: any = {
            method: opt.method || 'GET',
            mode: opt.mode ? opt.mode : isDev ? 'cors' : 'no-cors',
            credentials: 'include'
        };
        if (opt.method !== 'GET' && !_.isNil(opt.method)) {
            fetchSet.body = opt.data || '';
        }
        const prom = fetch(url, {
            ...fetchSet
        });

        return prom
            .then((res: any) => {
                if (res.status < 200 || res.status >= 300) {
                    return resolve(null);
                }
                return res.json();
            })
            .then((json: any) => {
                return resolve(json);
            })
            .catch((e: any) => {
                if (isDev) {
                    window.console.warn('fetch error::', e);
                }
                return resolve(null);
            });
    });
};


/**
 * @description 解析地址中的query，以对象返回
 */
export const queryUtil = (): any => {
    const search: string = window.location.search.trim();
    if (!search) {
        return {};
    }
    const querys = search.replace(/^\?/, '').split('&');
    const result: any = {};
    querys.forEach((query: string) => {
        const temp: any[] = decodeURIComponent(query).split('=');
        result[temp[0]] = temp[1] || '';
    });
    return result;
};

/**
 * @description 改变路径
 * @param url 地址
 */
export const changeUrl = (url: string) => {
    window.history.pushState(null, '', url);
};

interface IParam {
    key: string;
    value: string | number;
}
/**
 * @description 变更地址中的query（不改变其他query）
 * @param param query对象
 * @param path 路径，默认为当前pathName
 * @param getPath false只跳转，true将地址返回去
 */
export const changeUrlQuery = (
    param: IParam | IParam[],
    path: string = window.location.pathname,
    getPath: boolean = false
) => {
    const query = queryUtil();
    const opt = _.isArray(param) ? param : [param];
    opt.forEach((para: IParam) => {
        query[para.key] = para.value;
    });
    const search: string[] = [];
    Object.keys(query).forEach((key: string) => {
        search.push(`${key}=${encodeURIComponent(query[key])}`);
    });
    const resultUrl: string = `${path}?${search.join('&')}`;
    if (getPath) {
        return resultUrl;
    } else {
        changeUrl(resultUrl);
    }
};

// 将对象转换成restful的参数形式 xx=cc&cc=yy
export const restFulParam = (param: any) => {
    if (_.isNil(param) || _.isEmpty(param) || _.isString(param) || _.isArray(param)) {
        return '';
    }
    const tempArr: string[] = [];
    // tslint:disable-next-line:forin
    for (const i in param) {
        tempArr.push(`${i}=${param[i]}`);
    }
    return tempArr.join('&');
};