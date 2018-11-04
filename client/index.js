/* eslint-disable react/react-in-jsx-scope */
import React from "react"; // eslint-disable-line
import ReactDOM from "react-dom";

import App from "./app.jsx";
// import Oops from './oops.jsx';

import "../public/style.css";

window.attachApp = userId => {
  ReactDOM.render(<App userId={userId} />, document.getElementById("content"));
};
