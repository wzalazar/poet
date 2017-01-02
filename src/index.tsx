import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

ReactDOM.render(
  <Hello framework="the best framework ever" compiler="typescript for ye" />,
  document.getElementById("example")
);
