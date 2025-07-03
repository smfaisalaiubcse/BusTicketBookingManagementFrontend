
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../constants';

const AdminBusManagement: React.FC = () => {
  const { token } = useAuth();
  const [busName, setBusName] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [companyName, setCompanyName] = useState('');
  const [routes, setRoutes] = useState([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRouteChange = (index: number, value: string) => {
    const newRoutes = [...routes];
    newRoutes[index].name = value;
    setRoutes(newRoutes);
  };

  const addRoute = () => {
    setRoutes([...routes, { name: '' }]);
  };

  const removeRoute = (index: number) => {
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const payload = {
      name: busName,
      capacity: Number(capacity),
      company: { name: companyName },
      routes: routes.filter(r => r.name.trim() !== ''), // Filter out empty route strings
    };

    if (payload.routes.length === 0) {
      setError("Please add at least one valid route.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/bus/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add bus.');
      }

      setSuccess(`Bus "${busName}" added successfully!`);
      // Reset form
      setBusName('');
      setCapacity(40);
      setCompanyName('');
      setRoutes([{ name: '' }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Bus Management</h1>
      <div className="bg-bg-secondary p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border-primary pb-4">Add a New Bus</h2>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}
        {success && <div className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="busName" className="block text-sm font-medium text-text-secondary">Bus Name</label>
              <input type="text" id="busName" value={busName} onChange={e => setBusName(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md" />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-text-secondary">Capacity</label>
              <input type="number" id="capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))} required className="mt-1 w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md" />
            </div>
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-text-secondary">Company Name</label>
            <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Routes</label>
            <div className="space-y-3 mt-2">
              {routes.map((route, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g., Dhaka-Chittagong"
                    value={route.name}
                    onChange={e => handleRouteChange(index, e.target.value)}
                    className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md"
                  />
                  {routes.length > 1 && (
                    <button type="button" onClick={() => removeRoute(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-md">Remove</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addRoute} className="mt-3 text-sm font-semibold text-brand-primary hover:text-brand-light">+ Add Another Route</button>
          </div>
          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-brand-secondary transition-colors disabled:opacity-50">
              {isLoading ? 'Adding Bus...' : 'Add Bus'}
            </button>
          </div>
        </form>
      </div>
       <div className="bg-bg-secondary p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border-primary pb-4">Create a New Trip</h2>
        <p className="text-text-secondary text-center">Feature coming soon.</p>
       </div>
    </div>
  );
};

export default AdminBusManagement;
