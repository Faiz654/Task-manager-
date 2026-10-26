import React from "react";
import { useLocation } from "react-router-dom";

import Header from "./Componenets/Header/Header";
import Footer from "./Componenets/Footer/Footer";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const { pathname } = useLocation();

  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
  ].includes(pathname);

  const isAdminPanelPage = pathname.startsWith("/dashboard");

  const showPublicLayout = !isAuthPage && !isAdminPanelPage;

  return (
    <>
      {showPublicLayout && <Header />}

      <AppRoutes />

      {showPublicLayout && <Footer />}
    </>
  );
}

export default App;
