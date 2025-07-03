
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';
import { Trip, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { BusIcon, CalendarIcon, MapPinIcon, TicketIcon } from '../components/Icons';

const TripCard: React.FC<{ trip: Trip; onBook: (trip: Trip) => void }> = ({ trip, onBook }) => (
    <div className="bg-bg-secondary rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-brand-light">{trip.bus.name}</h3>
                    <div className="flex items-center gap-2 text-text-secondary mt-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{trip.route.name.replace('-', ' → ')}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-brand-primary">${trip.price}</p>
                    <p className="text-sm text-text-secondary">per seat</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-primary">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <TicketIcon className="w-4 h-4" />
                    <span>{trip.availableSeats} seats available</span>
                </div>
            </div>
            <button 
                onClick={() => onBook(trip)}
                disabled={trip.availableSeats === 0}
                className="w-full mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                {trip.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
            </button>
        </div>
    </div>
);

const BookingModal: React.FC<{
    trip: Trip;
    user: User;
    onClose: () => void;
    onBookingSuccess: () => void;
}> = ({ trip, user, onClose, onBookingSuccess }) => {
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const handleBooking = async () => {
        setIsBooking(true);
        setError(null);

        const bookingPromises = [];
        for (let i = 0; i < seatsToBook; i++) {
            // NOTE: The API requires a `seatNumber`. Without a seat map, we generate a placeholder.
            // This assumes the backend can handle this or that this is a simplified booking process.
            const seatNumber = `S${Math.floor(Math.random() * 100) + i}`;
            bookingPromises.push(
                fetch(`${API_BASE_URL}/api/bookings`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tripId: trip.id,
                        seatNumber: seatNumber,
                    }),
                })
            );
        }

        try {
            const responses = await Promise.all(bookingPromises);
            const failedBooking = responses.find(res => !res.ok);

            if (failedBooking) {
                const data = await failedBooking.json();
                throw new Error(data.message || 'One or more bookings failed. Please try again.');
            }
            onBookingSuccess();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-bg-secondary rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-2 text-text-primary">Confirm Your Booking</h2>
                <p className="text-text-secondary mb-4">You are booking a trip on <span className="font-bold">{trip.bus.name}</span> for route <span className="font-bold">{trip.route.name}</span>.</p>
                <div className="mb-4">
                    <label htmlFor="seats" className="block text-sm font-medium text-text-secondary">Number of Seats</label>
                    <input
                        id="seats"
                        type="number"
                        min="1"
                        max={trip.availableSeats}
                        value={seatsToBook}
                        onChange={(e) => setSeatsToBook(parseInt(e.target.value, 10))}
                        className="mt-1 w-full pl-4 pr-4 py-2 bg-bg-primary border border-border-primary rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>
                <div className="font-bold text-xl text-brand-light mb-4">
                    Total Price: ${seatsToBook * trip.price}
                </div>

                {error && <p className="text-red-400 bg-red-500/10 p-2 rounded-md mb-4">{error}</p>}
                
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-text-secondary hover:bg-border-primary">Cancel</button>
                    <button onClick={handleBooking} disabled={isBooking} className="px-6 py-2 rounded-md bg-brand-primary text-white font-bold hover:bg-brand-secondary disabled:opacity-50">
                        {isBooking ? 'Booking...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FindBusesPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const route = searchParams.get('route');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    useEffect(() => {
        if (!route || !fromDate || !toDate) {
            setError("Please provide a route and date to search for buses.");
            setLoading(false);
            return;
        }

        const fetchTrips = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/buses/search?route=${route}&fromDate=${fromDate}&toDate=${toDate}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch buses.');
                }
                const data = await response.json();
                setTrips(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [route, fromDate, toDate]);

    const handleBookClick = (trip: Trip) => {
        if (!user || !token) {
            navigate('/login');
            return;
        }
        setSelectedTrip(trip);
    };

    const handleBookingSuccess = () => {
        setSelectedTrip(null);
        navigate('/my-bookings');
    };

    if (loading) return <div className="text-center py-10">Loading buses...</div>;
    if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

    return (
        <div>
            <div className="bg-bg-secondary p-4 rounded-lg mb-8 shadow-md">
                <h1 className="text-2xl font-bold text-text-primary">Search Results</h1>
                <p className="text-text-secondary">Showing buses for route <span className="font-bold text-brand-light">{route}</span> on <span className="font-bold text-brand-light">{new Date(fromDate || '').toLocaleDateString()}</span></p>
            </div>

            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} onBook={handleBookClick} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-bg-secondary rounded-lg">
                    <BusIcon className="w-16 h-16 mx-auto text-border-primary mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary">No Buses Found</h2>
                    <p className="text-text-secondary mt-2">Sorry, we couldn't find any buses for your search criteria.</p>
                     <button onClick={() => navigate('/')} className="mt-6 bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-brand-secondary transition-colors">
                        Change Search
                    </button>
                </div>
            )}

            {selectedTrip && user && (
                <BookingModal 
                    trip={selectedTrip}
                    user={user}
                    onClose={() => setSelectedTrip(null)}
                    onBookingSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default FindBusesPage;
