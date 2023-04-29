import { useState } from "react";
import { useAuth } from "./AuthProvider";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      console.log(data)
      dispatch({ type: "LOGIN", payload: data.accessToken });

      // Do something with the auth token (e.g. redirect to another page)

    } catch (error) {
      console.error(error);
    }
  };

  const handleSignout = () => {
    dispatch({ type: "LOGOUT" });
    // Do something to clear the authenticated state (e.g. redirect to login page)
  };

  return state.isAuthenticated ? (
    <button onClick={handleSignout}>Sign Out</button>
  ) : (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export {  LoginForm };