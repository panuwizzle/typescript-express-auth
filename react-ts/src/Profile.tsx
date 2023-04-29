import { useAuth } from "./AuthProvider";

const Profile = () => {
  const { state } = useAuth();

  return state.isAuthenticated ? (
    <div>
      <h2>Welcome back!</h2>
      <p>Your authentication token is: {state.authToken}</p>
    </div>
  ) : (
    <div>
      <h2>Please log in</h2>
    </div>
  );
};

export default Profile;
