namespace AddisEats.Api.DTOs;

public record CreateOrderDTO
(
    int RestaurantId,
    int MenuItemId,
    string CoustomerName,
    string DelivaryAddress,
    string CustomerPhone,
    int Quantity,
    decimal TotalAmount
);