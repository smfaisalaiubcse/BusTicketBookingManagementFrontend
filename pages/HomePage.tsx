
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, CalendarIcon, SearchIcon, ArrowRightIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      // Construct route name as per backend (e.g., "Dhaka-Chittagong")
      const route = `${from}-${to}`;
      // The API expects fromDate and toDate, so we use the selected date for both to search for a single day.
      navigate(`/find-buses?route=${route}&fromDate=${date}&toDate=${date}`);
    } else {
      alert("Please fill in all fields to search.");
    }
  };

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section 
        className="bg-cover bg-center rounded-lg shadow-xl -mt-8 -mx-4 mb-12 p-8 md:p-16"
        style={{backgroundImage: "linear-gradient(rgba(3, 4, 94, 0.7), rgba(31, 41, 55, 0.8)), url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1887&auto=format&fit=crop')"}}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-4 animate-fade-in-down">
          Your Next Journey Starts Here
        </h1>
        <p className="text-lg md:text-xl text-brand-light mb-8 animate-fade-in-up">
          Book bus tickets online with ease. Safe, reliable, and comfortable travel.
        </p>
      </section>

      {/* Search Form */}
      <section className="bg-bg-secondary p-6 md:p-8 rounded-lg shadow-2xl max-w-4xl mx-auto -mt-16 md:-mt-24 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Find Your Bus</h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="relative text-left">
            <label htmlFor="from" className="block text-sm font-medium text-text-secondary mb-1">From</label>
            <MapPinIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g., Dhaka"
              required
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          
          <div className="flex items-center justify-center pt-6 md:pt-0">
             <ArrowRightIcon className="w-8 h-8 text-brand-primary hidden md:block mt-2"/>
          </div>

          <div className="relative text-left">
            <label htmlFor="to" className="block text-sm font-medium text-text-secondary mb-1">To</label>
            <MapPinIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g., Chittagong"
              required
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>

          <div className="relative text-left col-span-1 md:col-span-1">
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <CalendarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          
          <button type="submit" className="md:col-span-4 w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-md hover:bg-brand-secondary transition-colors mt-4">
            <SearchIcon className="w-5 h-5" />
            <span>Search Buses</span>
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
