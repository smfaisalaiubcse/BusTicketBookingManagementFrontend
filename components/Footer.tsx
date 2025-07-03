
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-bg-secondary mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-text-secondary">
        <p>&copy; {currentYear} BusJet. All rights reserved.</p>
        <p className="text-sm mt-1">Your journey, our priority.</p>
      </div>
    </footer>
  );
};

export default Footer;
