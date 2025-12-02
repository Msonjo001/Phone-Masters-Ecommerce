import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig.js";

export default function UserProtectedRoute({ children }) {
  const user = auth.currentUser;

  // If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
