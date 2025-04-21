import { useState } from 'react';
import Home from './Home';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from './Portfolio';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio/:id" element={<Portfolio />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
