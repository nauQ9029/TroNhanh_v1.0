import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../../pages/CommonPage/HomePage/HomePage";
import AboutUs from "../../pages/CommonPage/HomePage/AboutUs";

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
};

export default RoutesApp;
