import { useAuth0 } from "@auth0/auth0-react";
import ProductManagementPage from "../products/ProductManagementPage";

function App() {
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  if (isLoading) return "Loading...";

  return isAuthenticated ? (
    <>
    <div style={{ border: "1px solid black", padding: "1rem", marginBottom: "2rem" }}>
      <p>Logged in as {user.email}</p>

      <h1>User Profile</h1>
      <button onClick={logout}>Logout</button>
    </div>
      

      <div>
        <h1>Product Management</h1>
        <ProductManagementPage />
      </div>

      
    </>
  ) : (
    <>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={login}>Login</button>
    </>
  );
}

export default App;
