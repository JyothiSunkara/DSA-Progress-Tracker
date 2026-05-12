import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:static top-0 left-0 min-h-screen w-64 bg-gray-800 p-5 z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Close Button Mobile */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h1 className="text-xl font-bold">DSA Tracker</h1>

          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {/* Desktop Title */}
        <h1 className="text-2xl font-bold mb-10 hidden md:block">
          DSA Tracker
        </h1>

        <nav className="flex flex-col gap-5">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/problems"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Problems
          </Link>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="text-left text-red-400 hover:text-red-500 mt-5"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-800 p-4 flex items-center">
          <button onClick={() => setIsOpen(true)} className="text-2xl">
            ☰
          </button>

          <h1 className="ml-4 text-lg font-semibold">DSA Tracker</h1>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
