import React from "react";
import { auth } from "../firebaseConfig.js";

export default function Dashboard() {
  const user = auth.currentUser;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Welcome to PhoneMasters Kenya Dashboard
      </h1>
      {user ? (
        <p>Logged in as: <strong>{user.email}</strong></p>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
