import React from "react";
import { BrowserRouter } from "react-router-dom";
import './App.css';
import RouterAd from "./routes/AdminRoutes/RoutesAd";
import HeaderComponent from "./components/header/header";
import FooterComponent from "./components/footer/footer";

import RoutesCus from "./routes/CustomerRoutes/RoutesCus";
import LayoutCus from "./components/layout/layout-customer";
function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <LayoutCus>
        <RoutesCus />
      </LayoutCus>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;