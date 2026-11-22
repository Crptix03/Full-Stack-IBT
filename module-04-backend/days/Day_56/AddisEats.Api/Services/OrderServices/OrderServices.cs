using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Services.OrderServices;

public class OrderServices : IOrderService
{
    private static readonly List<Order> _orders = new List<Order>();

    private static int _nextId = 1;

    public Order? GetById(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        return order;
    }

    public Order CreateOrder(CreateOrderDTO createDTO)
    {
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
        return o;
    }

}