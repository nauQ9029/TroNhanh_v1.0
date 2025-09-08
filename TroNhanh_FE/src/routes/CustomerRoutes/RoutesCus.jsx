import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../../pages/CustomerPage/components/layout/CustomerLayout";
import ApartmentSearch from "../../pages/CustomerPage/ApartmentSearch/ApartmentSearch";
import ApartmentDetails from "../../pages/CustomerPage/ApartmentDetails/ApartmentDetails";
import ProfilePage from "../../pages/CommonPage/Cus_Profile/Profile";
import CheckoutPage from "../../pages/CustomerPage/Checkout/CheckoutPage";
import BookingResult from "../../pages/CustomerPage/Checkout/BookingResult";
import ReportPage from "../../pages/CustomerPage/Report/ReportPage";
import Communication from "../../pages/CustomerPage/Communication/communication";

const RoutesCus = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<ApartmentSearch />} />
        <Route path="search" element={<ApartmentSearch />} />
        <Route path="property/:id" element={<ApartmentDetails />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="booking-result" element={<BookingResult />} />
        <Route path="profile/*" element={<ProfilePage />} />
        <Route path="reports" element={<ReportPage />} />
        <Route path="chat/:id" element={<Communication />} />
      </Route>
    </Routes>
  );
};

export default RoutesCus;