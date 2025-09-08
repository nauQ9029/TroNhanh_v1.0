import { Routes, Route } from "react-router-dom";
import Home from "../../features/apartment/pages/HomePage-DELETEAFTERMERGE/Home";
import ApartmentSearch from "../../features/apartment/pages/ApartmentSearch/ApartmentSearch";
import ApartmentDetails from "../../features/apartment/pages/ApartmentDetails/ApartmentDetails";
import OwnerInformation from "../../features/apartment/pages/OwnerInfo/OwnerInfo";
import NotFound from "../../features/apartment/pages/NotFound/NotFound";
import CheckoutPage from "../../features/apartment/pages/Checkout/CheckoutPage";

const CusRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ApartmentSearch />} />
      <Route path="/property/:id" element={<ApartmentDetails />} />
      <Route path="/owner/:id" element={<OwnerInformation />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CusRoutes;
