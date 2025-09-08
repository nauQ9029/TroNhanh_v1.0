import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "../../pages/Exception/NotFound/NotFound";

const ExceptionRoutes = () => {
  return (
    <Routes>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ExceptionRoutes;