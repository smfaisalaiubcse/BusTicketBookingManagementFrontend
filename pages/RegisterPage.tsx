
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-bg-secondary rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-text-primary">Create an Account</h1>
        <p className="text-center text-text-secondary">Join BusJet and start your journey</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-md" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-md" role="alert">
            <p>Registration successful! Redirecting to login...</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary" placeholder="Full Name" />
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary" placeholder="Email Address" />
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary" placeholder="Password" />
              <input name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary" placeholder="Confirm Password" />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-primary hover:text-brand-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
