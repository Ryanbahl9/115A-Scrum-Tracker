import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

document.body.style.margin = "0";
document.body.style.padding = "0";

const Root = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.render(Root, document.getElementById("root"));
