import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Products from "./Pages/Products";
import HomePage from "./Pages/homepage";
import LoginPage from "./Pages/login";
import SignUpPage from "./Pages/register";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div className="App px-4 overflow-hidden">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </div>
  );
}

export default App;
