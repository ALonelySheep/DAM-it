import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'AuthProvider';
// import { authContext } from 'AuthProvider';
// import { UserContext } from "../UserContext";
// import React, { useContext } from "react";


export default function AuthGate() {
  const auth = useAuth();
  return auth.userInfo ? <Outlet /> : <Navigate to="/login" />;
}