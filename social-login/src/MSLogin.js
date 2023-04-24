import React from "react";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

const LoginWithMicrosoftButton = () => {
  const { instance } = useMsal();
  const signInConfig = {
    scopes: ["user.read"],
  };

  const handleLogin = () => {
    instance
      .loginPopup(signInConfig)
      .then(async () => {
        // Handle successful login
        const accounts = instance.getAllAccounts();
        const abc = await instance.acquireTokenSilent({
          scopes: ["user.read"],
          account: accounts[0],
        });
        console.log(abc);
        console.log(`Bearer ${abc.accessToken}`);
      })
      .catch((error) => {
        console.log(error);
        // Handle login failure
      });
  };
  const handleLogout = () => {
    instance.logout();
  };

  return (
    <>
      <UnauthenticatedTemplate>
        <button onClick={handleLogin} type="button">
          Login with Microsoft
        </button>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <button onClick={handleLogout} type="button">
          MS logout
        </button>
      </AuthenticatedTemplate>
    </>
  );
};

export default LoginWithMicrosoftButton;
