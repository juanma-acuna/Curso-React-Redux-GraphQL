import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/home/HomePage";
import FavPage from "./components/favs/FavPage";
import LoginPage from "./components/login/LoginPage";
import GraphQlHome from "./components/home/GraphQlHome";

function PrivateRoute({ path, component, ...rest }) {
  let storage = localStorage.getItem("storage");
  storage = JSON.parse(storage);
  console.log({ storage });
  if (storage && storage.user) {
    return <Route path={`${path}`} component={component} {...rest} />;
  } else {
    console.log("2");
    return <Redirect to="/login" {...rest} />;
  }
}

export default function Routes() {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute path="/favs" component={FavPage} />
      <Route path="/login" component={LoginPage} />
    </Switch>
  );
}
