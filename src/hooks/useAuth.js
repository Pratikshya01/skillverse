import { useDispatch, useSelector } from "react-redux";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  updateUser,
} from "../features/auth/authSlice";
import api from "../lib/axios";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = async (email, password) => {
    try {
      const result =  await dispatch(loginAction({ email, password })).unwrap();
      return { success: true, data: result?.data };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login failed. Please check your credentials.",
      };
    }
  };

  const register = async (userData) => {
    try {
      await dispatch(registerAction(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.post(`/user/edit/${user._id}`, userData);
      dispatch(updateUser(response.data.data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
  };
};
