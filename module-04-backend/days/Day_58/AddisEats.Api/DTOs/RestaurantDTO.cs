namespace AddisEats.Api.DTOs;

public record RestaurantDTO
(
     int Id,
     string Name,
     string Address,
     string Phone,
     bool IsActive
);