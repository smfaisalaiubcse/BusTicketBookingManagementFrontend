
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BusIcon, UsersIcon } from '../components/Icons';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../constants';

interface AdminStats {
  totalBuses: number;
  totalCustomers: number;
  totalBookings: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch admin statistics.");
        }
        const data: AdminStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Admin Dashboard</h1>
      <p className="text-text-secondary mb-8">Welcome, Admin. Here you can manage the application.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-light">Total Buses</h2>
          <p className="text-3xl font-extrabold mt-2">{loading ? '...' : stats?.totalBuses ?? '--'}</p>
        </div>
        <div className="bg-bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-light">Total Customers</h2>
          <p className="text-3xl font-extrabold mt-2">{loading ? '...' : stats?.totalCustomers ?? '--'}</p>
        </div>
        <div className="bg-bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-light">Total Bookings</h2>
          <p className="text-3xl font-extrabold mt-2">{loading ? '...' : stats?.totalBookings ?? '--'}</p>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Management Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/buses" className="flex items-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-5 rounded-lg transition-colors">
            <BusIcon className="w-6 h-6" />
            <span>Manage Buses & Trips</span>
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-5 rounded-lg transition-colors">
            <UsersIcon className="w-6 h-6" />
            <span>View Customers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
