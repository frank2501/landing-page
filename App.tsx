import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import NotFoundPage from './pages/NotFoundPage';
import DemosPage from './pages/DemosPage';
import GymDemoPage from './pages/demos/GymDemoPage';
import HotelDemoPage from './pages/demos/HotelDemoPage';
import ClinicDemoPage from './pages/demos/ClinicDemoPage';

import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const demoSubPages = ['/demos/gimnasios', '/demos/hoteles', '/demos/consultorios'];

function ConditionalHeader() {
  const { pathname } = useLocation();
  if (demoSubPages.includes(pathname)) return null;
  return <Header />;
}

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <ConditionalHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/implementaciones" element={<BlogPage />} />
          <Route path="/implementaciones/:slug" element={<ArticlePage />} />

          <Route path="/demos" element={<DemosPage />} />
          <Route path="/demos/gimnasios" element={<GymDemoPage />} />
          <Route path="/demos/hoteles" element={<HotelDemoPage />} />
          <Route path="/demos/consultorios" element={<ClinicDemoPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/pago/:id" element={<CheckoutPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
