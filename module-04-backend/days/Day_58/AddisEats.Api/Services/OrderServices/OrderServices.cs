using AddisEats.Api.Models;
using AddisEats.Api.DTOs;
using AddisEats.Api.Common;
using AddisEats.Api.Services.RestaurantServices;

namespace AddisEats.Api.Services.OrderServices;

public class OrderServices : IOrderService
{
    private static readonly List<Order> _orders = new List<Order>();

    private static int _nextId = 1;

    private readonly IRestaurantService _restaurantService;

    public OrderServices(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    public Order? GetById(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        return order;
    }

    public Result<Order> CreateOrder(CreateOrderDTO createDTO)
    {
        var restaurant = _restaurantService.GetById(createDTO.RestaurantId);
        if(restaurant is null)
        {
            return Result<Order>.Fail("RESTAURANT_NOT_FOUND", "The selected restaurant does not exist.", 404);
        }

        if(!restaurant.IsActive)
        {
            return Result<Order>.Fail("RESTAURANT_NOT_ACTIVE", "The selected restaurant is not active.", 409);
        }

        Order o = new Order
        {
            Id = _nextId++,
            RestaurantId = createDTO.RestaurantId,
            MenuItemId = createDTO.MenuItemId,
            CoustomerName = createDTO.CoustomerName,
            DelivaryAddress = createDTO.DelivaryAddress,
            CustomerPhone = createDTO.CustomerPhone,
            Quantity = createDTO.Quantity,
            TotalAmount = createDTO.TotalAmount
        };

        _orders.Add(o);
        return Result<Order>.Ok(o);
    }

}