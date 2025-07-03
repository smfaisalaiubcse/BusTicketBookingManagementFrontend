
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BusIcon, LogOutIcon } from './Icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-bg-secondary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-primary hover:text-brand-light transition-colors">
          <BusIcon className="w-8 h-8" />
          <span>BusJet</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) =>`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-light bg-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}>Home</NavLink>
          <NavLink to="/find-buses" className={({ isActive }) =>`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-light bg-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}>Find Buses</NavLink>
          
          {user ? (
            <>
              {user.role === 'ADMIN' ? (
                <NavLink to="/admin/dashboard" className={({ isActive }) =>`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-light bg-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}>Dashboard</NavLink>
              ) : (
                <NavLink to="/my-bookings" className={({ isActive }) =>`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-light bg-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}>My Bookings</NavLink>
              )}
              <span className="text-text-secondary text-sm hidden sm:block">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-bg-primary" aria-label="Logout">
                <LogOutIcon className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) =>`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-light bg-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'}`}>Login</NavLink>
              <NavLink to="/register" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-secondary transition-colors">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
