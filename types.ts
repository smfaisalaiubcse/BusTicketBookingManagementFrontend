// Represents a user, who can be a customer or an admin
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface Company {
  id?: number;
  name: string;
}

export interface Route {
  id?: number;
  name: string;
}

// Represents a physical bus vehicle
export interface Bus {
  id: number;
  name: string;
  capacity: number;
  company: Company;
  routes: Route[];
}

// Represents a scheduled journey for a bus on a route
export interface Trip {
  id: number;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number; // Assuming the search API provides this
  bus: Bus;
  route: Route;
}

// Represents a user's confirmed booking
export interface Booking {
  id: number;
  seatNumber: string;
  bookingTime: string;
  trip: Trip;
}
