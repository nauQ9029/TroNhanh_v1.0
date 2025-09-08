// routes/AppRoutes/RouterHomePage.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/CommonPage/HomePage/HomePage";

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default RoutesApp;
