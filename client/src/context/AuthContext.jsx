import { createContext } from "react";

export const AuthContext = createContext(undefined);

const user = JSON.parse(localStorage.getItem('user'));

export const AuthContextProvider = ({children}) => {
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
}