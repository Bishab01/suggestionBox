import { Link, NavLink, useNavigate } from "react-router-dom";
import { Landmark, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import {useAuth} from "../context/authContext";

function Navbar() {
  const { user, loading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const citizenNav = [
    {name:"News & Plans", path:"/home"},
  ];

  const adminNav = [
    {name:"Admin Dashboard", path:"/dashboard"},
    {name:"News & Plans", path:"/home"},
  ];  

  const navigations = isAdmin ? adminNav : citizenNav;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex h-fit bg-[#023166] text-white shadow-md">
      <div className="flex w-full items-center justify-between gap-4 py-4 px-4 sm:px-5.5 md:px-7 lg:px-8.5 xl:px-10">
        <div className="flex items-center gap-2 text-xl font-semibold whitespace-nowrap">
          <Landmark className="size-6 text-[#ff9c09]" />
          <span className="hidden sm:inline">Sujav Peti</span>
        </div>

        <nav className="flex items-center gap-2 text-xs sm:text-sm sm:gap-3 md:gap-5 md:text-base">
          {navigations.map((item) => (
              <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                      `font-medium transition-colors ${
                        isActive
                            ? "text-[#ff9c09]"
                            : "text-white hover:text-[#ff9c09]"
                      }`
                  }
              >
                  {item.name}
              </NavLink>
          ))}
          {loading ? null :user ? (
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-1
                font-medium rounded-lg
                border border-white/60
                px-2 py-1.5
                sm:px-3
                hover:bg-white/10
              "
            >
              <LogOut className="size-4" />
              Logout
            </button>
          ) : (
            <>
              {/* when no user */}
              <Link 
                to="/login" 
                className="
                  flex items-center gap-1
                  font-medium rounded-lg
                  border border-white/60
                  px-2 py-1.5
                  sm:px-3
                  hover:bg-white/10
                "
              >
                <LogIn className="size-4"/>
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-[#ff9c09]
                  px-2 py-1.5
                  sm:px-3
                  font-medium text-white
                  hover:bg-[#fc9904]/95
                "
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
