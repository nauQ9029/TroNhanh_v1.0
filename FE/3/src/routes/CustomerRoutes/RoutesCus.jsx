import { Routes, Route } from "react-router-dom";
import ApartmentSearch from "../../pages/CustomerPage/ApartmentSearch/ApartmentSearch";
import ApartmentDetails from "../../pages/CustomerPage/ApartmentDetails/ApartmentDetails";
import OwnerInformation from "../../pages/CustomerPage/OwnerInfo/OwnerInfo";
import NotFound from "../../pages/CustomerPage/NotFound/NotFound";
import CheckoutPage from "../../pages/CustomerPage/Checkout/CheckoutPage";

const RoutesCus = () => {
  return (
    <Routes>
      <Route path="/customer/search" element={<ApartmentSearch />} />
      <Route path="/customer/property/:id" element={<ApartmentDetails />} />
      <Route path="/customer/owner/:id" element={<OwnerInformation />} />
      <Route path="/customer/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesCus;
