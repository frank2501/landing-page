import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto', // 'smooth' might be too slow for full page transitions
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
