import React from "react";
import { SWRConfig } from "swr";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import App from "./App";
import { fetcher } from "./api";
import Provider from "./store/Provider";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SWRConfig
        value={{
          refreshInterval: 50000,
          fetcher,
        }}
      >
        <Provider>
          <App />
        </Provider>
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
