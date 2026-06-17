import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import { authAdapter } from '../api/authAdapter'
import ProductManagementPage from '../products/ProductManagementPage'

function AppContent() {
  const { isLoading, isAuthenticated, error, loginWithRedirect: login, logout: auth0Logout, user, getAccessTokenSilently } =
    useAuth0()

  const signup = () => login({ authorizationParams: { screen_hint: 'signup' } })

  const logout = () => auth0Logout({ logoutParams: { returnTo: window.location.origin } })

  /**
   * Initialize Auth0 token provider for the API client
   * This ensures all API requests automatically include the access token
   */
  useEffect(() => {
    if (isAuthenticated) {
      authAdapter.initialize(getAccessTokenSilently)
    }
  }, [isAuthenticated, getAccessTokenSilently])

  if (isLoading) return <div>Loading...</div>

  return isAuthenticated ? (
    <div>
      <div style={{ border: '1px solid black', padding: '1rem', marginBottom: '2rem' }}>
        <p>Logged in as {user?.email}</p>

        <h1>User Profile</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div>
        <h1>Product Management</h1>
        <ProductManagementPage />
      </div>
    </div>
  ) : (
    <div>
      {error && <p>Error: {error.message}</p>}

      <button onClick={signup}>Signup</button>

      <button onClick={login}>Login</button>
    </div>
  )
}

function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  )
}

export default App

