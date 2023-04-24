import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: "0829d66d-df72-44c4-8229-0b04cd4496aa",
    redirectUri: "http://localhost:3001",
    authority:
      "https://login.microsoftonline.com/ffe70b60-777e-4efc-8028-4b1704fac3d0",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
