import "./App.css";
import { LoginForm } from "./LoginForm";
import { AuthProvider } from "./AuthProvider";
import Profile from "./Profile";
import LoginWithMicrosoftButton from "./MSLogin";

function App() {

  return (
    <>
      <AuthProvider>
        <LoginForm />
        <LoginWithMicrosoftButton />
        <Profile />
      </AuthProvider>
    </>
  );
}

export default App;
