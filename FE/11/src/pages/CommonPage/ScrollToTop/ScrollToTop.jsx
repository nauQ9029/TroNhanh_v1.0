// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll lên đầu trang mỗi khi đường dẫn thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Không hiển thị gì
};

export default ScrollToTop;
