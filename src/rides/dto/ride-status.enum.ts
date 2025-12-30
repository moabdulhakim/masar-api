export enum RideStatus {
    REQUESTED = "requested", // waiting for a driver to accept the ride
    PENDING = "pending", // driver accepted the ride
    ARRIVED = "arrived", // driver arrived at the pickup location
    STARTED = "started", // ride is started and in progress
    COMPLETED = "completed", // ride is completed
    CANCELLED = "cancelled", // ride is cancelled
}
