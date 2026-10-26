import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

// ==========================================
// GOOGLE CLIENT ID
// ==========================================

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error(
    "Google Client ID is missing. Check the frontend .env file."
  );
} else {
  console.log("Google Client ID loaded successfully.");
}

// ==========================================
// REACT APPLICATION
// ==========================================

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <App />

          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                padding: "16px 20px",
                fontSize: "14px",
                fontWeight: "600",
                maxWidth: "400px",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#ffffff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          color: "#b91c1c",
          background: "#f8fafc",
        }}
      >
        <div>
          <h2>Google Login Configuration Missing</h2>
          <p>
            Please add VITE_GOOGLE_CLIENT_ID to your frontend
            .env file and restart the development server.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);
