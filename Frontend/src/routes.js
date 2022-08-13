import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, NoNavLayout } from "./layouts";

// Route Views
import Register from "./views/Register";
import Login from "./views/Login";
import Home from "./views/Home";
import Search from "./views/Search";
import Redirector from "./views/Redirector";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/register" />
  },
  {
    path: "/register",
    layout: NoNavLayout,
    component: Register
  },
  {
    path: "/login",
    layout: NoNavLayout,
    component: Login
  },
  {
    path: "/home",
    layout: DefaultLayout,
    component: Home
  },
  {
    path: "/search",
    layout: DefaultLayout,
    component: Search
  },
  {
    path: "/routes",
    layout: DefaultLayout,
    component: Redirector
  }
];
