import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await api.post(
    "/auth/login",
    userData
  );

  // Store JWT token
  localStorage.setItem(
    "token",
    response.data.access_token
  );

  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Check whether user is logged in
export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("token")
  );
};