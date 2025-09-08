import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/layout/layout";
import Dashboard from "../../pages/AdminPage/Dashboard/dashboard";
import Users from "../../pages/AdminPage/User/Users";
import Posts from "../../pages/AdminPage/Post/Posts";
import Membership from "../../pages/AdminPage/Membership/Membership";
import Communication from "../../pages/AdminPage/Communication/Communication";
import Reports from "../../pages/AdminPage/Reports/Reports";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/posts" element={<Posts />} />
          <Route path="/admin/membership" element={<Membership />} />
          <Route path="/admin/communication" element={<Communication />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
      </Routes>
  );
}

export default App;