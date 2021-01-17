export enum LOCAL_STORAGE {
    TOKEN = "token",
    EXPIRY = "expiry",
    EMAIL = "email",
}

// Set the session in the local storage
export const setSession = (token: string, expiry: string): void => {
    localStorage.setItem(LOCAL_STORAGE.TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE.EXPIRY, expiry);
};

// Clear the session from the local storage
export const clearSession = (): void => {
    localStorage.removeItem(LOCAL_STORAGE.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.EXPIRY);
};

// Checks if the session is valid (locally) according to the expiration time
export const isSessionValid = (): boolean => {
    const expiry = localStorage.getItem(LOCAL_STORAGE.EXPIRY);
    if (expiry) {
      return +new Date(expiry) > +new Date();
    }
    return false;
};

// Creates the authorization header using the bearer token
export const getAuthHeaders = (token?: any) => ({
    Authorization: `Bearer ${
        token ? token : localStorage.getItem(LOCAL_STORAGE.TOKEN)
    }`,
});
