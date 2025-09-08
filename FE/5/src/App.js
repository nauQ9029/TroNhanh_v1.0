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

const hideLayout = ["/login", "/register"].some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideLayout && <HeaderComponent />}

      <main className="main-container" style={{ marginTop: hideLayout ? '0px' : '80px' }}>
        <Routes>
            <Route index element={<Navigate to="/homepage" replace />} />
          {/* Auth routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;
