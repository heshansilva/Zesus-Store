import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/purchase-cancel.jsx";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx"
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useCartStore } from "./stores/useCartStore.js";

function App() {
  const { user, checkAuth, checkingAuth  } = useUserStore();
  	const { getCartItems } = useCartStore();
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />

  return (
   <div className="min-h-screen bg-black text-white relative overflow-hidden transition-colors duration-300"> {/* Subtle gray overlay for depth */} 
   <div className="absolute inset-0 bg-[#121212] opacity-90" /> 
   <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/secret-dashboard' element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />} />
          <Route path='/category/:category' element={<CategoryPage />} />
          <Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-success' element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />} />
          <Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />

        </Routes>
      </div>
      <Toaster />
   </div>
  )   
}

export default App