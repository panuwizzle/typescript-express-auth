import * as React from "react";
import LoginForm from "./LoginForm";
import LoginWithMicrosoftButton from "./MSLogin";

const handleLoginGoogle = async () => {};

const handleLoginFacebook = async () => {};

function App({ instance }) {
  return (
    <div>
      <LoginWithMicrosoftButton prop={{ instance }} />
      <button onClick={handleLoginGoogle}>Google Login</button>
      <button onClick={handleLoginFacebook}>FB Login</button>
      <div>
        <LoginForm />
      </div>
    </div>
  );
}

export default App;
