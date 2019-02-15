import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Layout from './Layout';
import { store } from "./util";
import { Provider } from "react-redux";

const context: any = (require as any).context("./page", true, /index\.tsx/);
const keys: string[] = context.keys();
const page404: any = (require as any).context("./page", false, /404\.tsx/);
const keys404: string[] = page404.keys();

export default class App extends React.Component<any, any> {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <Router>
            <Switch>
              {keys.map((key: string) => {
                const pathArr: string[] = key
                  .replace(/^\./, "")
                  .replace(/\/index\.tsx$/, "")
                  .split("/");
                const path: string = pathArr.join("/") || "/";
                return (
                  <Route
                    key={path}
                    path={path}
                    exact
                    component={context(key).default}
                  />
                );
              })}
              {keys404.map((key: string) => {
                return <Route key={key} component={page404(key).default} />
              })}
            </Switch>
          </Router>
        </Layout>
      </Provider>
    );
  }
}
