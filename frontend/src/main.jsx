import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'
import useThemeStore from "./app/themeStore";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster position="top-right" />
      <App />
    </BrowserRouter>
  </StrictMode>
)
