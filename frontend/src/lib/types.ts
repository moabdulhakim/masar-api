// Types for the Masar ride-hailing application

// User types
export enum UserRole {
  DRIVER = 'driver',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  location?: { lat: number; lng: number };
  status: 'online' | 'offline';
  roles: UserRole[];
}

// Auth types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
}

// Driver types
export enum VehicleType {
  VAN = 'van',
  CAR = 'car',
  TRUCK = 'truck',
}

export interface Driver {
  id: string;
  rating: number;
  vehicleType: VehicleType;
  driverLicenseId: string;
  workingHours?: { from: string; to: string };
  isAvailable: boolean;
}

export interface CreateDriverDto {
  name: string;
  vehicleType: VehicleType;
  phone: string;
  email: string;
  password: string;
  driverLicenseId: string;
}

// Ride types
export enum RideStatus {
  REQUESTED = 'requested',
  PENDING = 'pending',
  ARRIVED = 'arrived',
  STARTED = 'started',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  startLocation: Location;
  endLocation: Location;
  cost: number;
  status: RideStatus;
  driver?: Driver;
}

export interface CreateRideDto {
  startLocation: Location;
  endLocation: Location;
  cost: number;
}

// Session types
export interface UserSession {
  id: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
}

// API Error type
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
