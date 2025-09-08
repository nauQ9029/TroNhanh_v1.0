// File: TroNhanh_FE/src/routes/OwnerRoutes/RoutesOw.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import OwnerLayout from "../../pages/OwnerPage/Components/Layout/OwnerLayout";
import ProfilePage from "../../pages/CommonPage/Cus_Profile/Profile";
import Accommodation from "../../pages/OwnerPage/Accommodation/accommodation";
import Statistics from "../../pages/OwnerPage/Statistics/Statistics";
import Report from "../../pages/OwnerPage/Report/report";
import Rating from "../../pages/OwnerPage/Rating/rating";
import DetailRating from "../../pages/OwnerPage/Rating/DetailRating";
import Communication from "../../pages/OwnerPage/Communication/communication";
import OwnerInbox from "../../pages/OwnerPage/Communication/OwnerInbox";
import Membership from "../../pages/OwnerPage/MemberShip/membership";
import PaymentResult from "../../pages/OwnerPage/MemberShip/PaymentResult";
import AboutUs from "../../pages/CommonPage/HomePage/AboutUs";
const RoutesOw = () => {
  return (
    <Routes>
      <Route element={<OwnerLayout />}>
        <Route index element={<Profile />} />
        <Route path="user-profile" element={<Profile />} />
        <Route path="accommodation" element={<Accommodation />} />
        <Route path="report" element={<Report />} />
        <Route path="rating" element={<Rating />} />
        <Route path="rating/:id" element={<DetailRating />} />
        <Route path="communication" element={<OwnerInbox />} />
        <Route path="membership" element={<Membership />} />
        <Route path="cancellation" element={<Cancellation />} />
      </Route>
    </Routes>
  );
};

export default RoutesOw;
