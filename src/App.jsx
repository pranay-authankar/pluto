import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { RelocationProvider } from './context/RelocationContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AskPlutoChat from './components/AskPlutoChat';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Requirements from './pages/Requirements';
import Recommendations from './pages/Recommendations';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Food from './pages/Food';
import FoodDetails from './pages/FoodDetails';
import Roommates from './pages/Roommates';
import PartnerDetails from './pages/PartnerDetails';
import Nearby from './pages/Nearby';
import NotFound from './pages/NotFound';

// Layout wrapper for all protected Pluto pages
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="app-shell">
        <Navbar />
        <Outlet />
        <AskPlutoChat />
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RelocationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Landing Page */}
            <Route path="/login" element={<Auth />} />

            {/* Protected Pluto Application Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/recommendations" element={<Recommendations />} />
              
              {/* Rooms Flow */}
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:roomId" element={<RoomDetails />} />

              {/* Food Flow */}
              <Route path="/food" element={<Food />} />
              <Route path="/food/:foodId" element={<FoodDetails />} />

              {/* Roommates Flow */}
              <Route path="/roommates" element={<Roommates />} />
              <Route path="/roommates/:partnerId" element={<PartnerDetails />} />

              {/* Nearby Explorer Flow */}
              <Route path="/nearby" element={<Nearby />} />
              <Route path="/nearby/:category" element={<Nearby />} />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RelocationProvider>
    </AuthProvider>
  );
}
