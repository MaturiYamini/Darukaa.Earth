import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  isAuthenticated,
} from "../services/authService";


const AuthContext = createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [isLoggedIn, setIsLoggedIn] =
    useState(isAuthenticated());


  const login = async (
    email,
    password
  ) => {

    const data = await loginUser({
      email,
      password,
    });

    setIsLoggedIn(true);

    return data;
  };


  const register = async (
    name,
    email,
    password
  ) => {

    const data = await registerUser({
      name,
      email,
      password,
    });

    return data;
  };


  const logout = () => {

    logoutUser();

    setIsLoggedIn(false);

  };


  return (

    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


export const useAuth = () => {

  return useContext(AuthContext);

};