import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';
import AssetManagerPage from '../pages/AssetManagerPage';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="assets" element={<AssetManagerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
