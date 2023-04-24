import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  const handleSubmit = async (event) => {
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
      localStorage.setItem("authToken", data.accessToken);
      setIsLoggedIn(true);

      // Do something with the auth token (e.g. redirect to another page)

    } catch (error) {
      console.error(error);
    }
  };

  const handleSignout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    // Do something to clear the authenticated state (e.g. redirect to login page)
  };

  return isLoggedIn ? (
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

export default LoginForm;
