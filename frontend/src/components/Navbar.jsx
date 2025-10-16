import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-95 backdrop-blur-md shadow-md border-b border-gray-600 z-40 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-wide flex items-center space-x-2 hover:text-gray-300 transition-colors duration-300"
          >
            ZESUS
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                className="relative group text-gray-300 hover:text-white transition-colors duration-300"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-white"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-white text-black rounded-full px-2 py-0.5 text-xs group-hover:bg-gray-300 transition-colors duration-300">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-black text-white border border-white px-3 py-1 rounded-md font-medium hover:bg-white hover:text-black flex items-center transition-colors duration-300"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="bg-black text-white border border-white py-2 px-4 rounded-md flex items-center hover:bg-white hover:text-black transition-colors duration-300"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-black text-white border border-white py-2 px-4 rounded-md flex items-center hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-black text-white border border-white py-2 px-4 rounded-md flex items-center hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
