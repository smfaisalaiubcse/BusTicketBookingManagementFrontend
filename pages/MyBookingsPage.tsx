
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL } from '../constants';
import { Booking } from '../types';
import { TicketIcon, CalendarIcon, MapPinIcon } from '../components/Icons';

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    return (
        <div className="bg-bg-secondary rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-brand-light">{booking.trip.bus.name}</h3>
                        <div className="flex items-center gap-2 text-text-secondary mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{booking.trip.route.name.replace('-', ' → ')}</span>
                        </div>
                    </div>
                     <div className="text-right">
                        <p className="text-lg font-bold text-brand-primary">Seat: {booking.seatNumber}</p>
                        <p className="text-sm text-text-secondary">Booked on {new Date(booking.bookingTime).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-primary text-sm text-text-secondary flex justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Departs: {new Date(booking.trip.departureTime).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyBookingsPage: React.FC = () => {
    const { user, token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        if (!user || !token) return;
        setLoading(true);
        setError(null);
        try {
            const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings/my`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!bookingsRes.ok) throw new Error('Failed to fetch bookings.');
            const userBookings: Booking[] = await bookingsRes.json();
            setBookings(userBookings);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);


    if (loading) return <div className="text-center py-10">Loading your bookings...</div>;
    if (error) return <div className="text-center py-10 text-red-400">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">My Bookings</h1>
            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.sort((a,b) => new Date(b.trip.departureTime).getTime() - new Date(a.trip.departureTime).getTime()).map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-bg-secondary rounded-lg">
                    <TicketIcon className="w-16 h-16 mx-auto text-border-primary mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary">No Bookings Found</h2>
                    <p className="text-text-secondary mt-2">You haven't booked any trips yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
