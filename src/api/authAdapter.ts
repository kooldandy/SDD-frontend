/**
 * Authentication Adapter for Auth0 Integration
 * 
 * Provides a centralized way to manage access tokens without storing them
 * directly in localStorage or sessionStorage. Implements secure token retrieval
 * on-demand from Auth0.
 */

class AuthAdapter {
  private tokenProvider: (() => Promise<string>) | null = null;

  /**
   * Initialize the auth adapter with a token provider function
   * @param provider - Async function that returns an access token from Auth0
   */
  initialize(provider: () => Promise<string>): void {
    this.tokenProvider = provider;
  }

  /**
   * Get the current access token
   * @returns The access token if available, null otherwise
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.tokenProvider) {
      return null;
    }

    try {
      return await this.tokenProvider();
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }
}

export const authAdapter = new AuthAdapter();

