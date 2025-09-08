import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HeaderComponent from './components/header/header';
import FooterComponent from './components/footer/footer';
import RoutesAd from './routes/AdminRoutes/RoutesAd';
import RoutesCus from './routes/CustomerRoutes/RoutesCus';
import RoutesOw from './routes/OwnerRoutes/RoutesOw';
import RoutesApp from './routes/AppRoutes/RoutesApp';
import ExceptionRoutes from './routes/ExceptionRoutes/ExceptionRoutes';
import LoginPage from './pages/CustomerPage/Auth/LoginPage';
import RegisterPage from './pages/CustomerPage/Auth/RegisterPage';
import { initAutoLogout, stopAutoLogout } from './services/autoLogout';
import useUser, { UserProvider } from './contexts/UserContext';
import { setupInterceptors } from './services/api';
import AboutUs from "./pages/CommonPage/HomePage/AboutUs";
import VerifyOtpPage from './pages/CustomerPage/Auth/VerifyOTP';
import ForgotPasswordPage from './pages/CustomerPage/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/CustomerPage/Auth/ResetPasswordPage';
import ScrollToTop from './pages/CommonPage/ScrollToTop/ScrollToTop';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SocketProvider } from './contexts/SocketContext';

function AppRoutes() {
  const location = useLocation();
  const { logout, loading } = useUser();


  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);


  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      initAutoLogout(logout);
    } else {
      stopAutoLogout();
    }
    return () => {
      stopAutoLogout();
    };
  }, [location, logout]);

  if (loading) return <p>Loading...</p>;

  const hideLayout = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"].some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideLayout && <HeaderComponent />}

      <main className="main-container" style={{ marginTop: hideLayout ? '0px' : '80px' }}>
        <Routes>
          <Route index element={<Navigate to="/homepage" replace />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Auth routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          {/* App routes */}
          <Route path="/homepage" element={<RoutesApp />} />
          <Route path="/owner/*" element={<RoutesOw />} />
          <Route path="/admin/*" element={<RoutesAd />} />
          <Route path="/customer/*" element={<RoutesCus />} />

          {/* Exception route */}
          <Route path="*" element={<ExceptionRoutes />} />
        </Routes>
      </main>

      {!hideLayout && <FooterComponent />}
    </>
  );
}


function AppWrapper() {
  return (
    <BrowserRouter>
      <UserProvider>
        <SocketProvider>
          <ScrollToTop />
          <AppRoutes />
        </SocketProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;