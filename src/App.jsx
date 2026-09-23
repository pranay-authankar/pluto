import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RelocationProvider } from './context/RelocationContext';
import Navbar from './components/Navbar';

// Pages
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

export default function App() {
  return (
    <RelocationProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <Routes>
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
          </Routes>
        </div>
      </BrowserRouter>
    </RelocationProvider>
  );
}
