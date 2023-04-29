import React, { createContext, useContext, useReducer } from "react";

interface AuthState {
  isAuthenticated: boolean;
  authToken: string | null;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT";
  payload?: string;
}

interface AuthContextProps {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  authToken: localStorage.getItem("authToken") || null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authToken", action.payload!);
      return {
        isAuthenticated: true,
        authToken: action.payload!,
      };
    case "LOGOUT":
      localStorage.removeItem("authToken");
      return {
        isAuthenticated: false,
        authToken: null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext);
  return { state, dispatch };
};

export { AuthProvider, useAuth };
