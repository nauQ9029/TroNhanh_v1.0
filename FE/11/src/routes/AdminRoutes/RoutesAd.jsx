import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../pages/AdminPage/components/Layout/AdminLayout";
import Dashboard from "../../pages/AdminPage/Dashboard/dashboard";
import Users from "../../pages/AdminPage/User/Users";
import Posts from "../../pages/AdminPage/Post/Posts";
import Membership from "../../pages/AdminPage/Membership/Membership";
import Communication from "../../pages/OwnerPage/Communication/communication";
import Reports from "../../pages/AdminPage/Reports/Reports";

const RoutesAd = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<Posts />} />
        <Route path="membership" element={<Membership />} />
        <Route path="/chat/:customerId" element={<Communication />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default RoutesAd;