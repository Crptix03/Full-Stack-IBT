using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Services.OrderServices;

public interface IOrderService
{
	Order? GetById(int id);
	Order CreateOrder(CreateOrderDTO createDTO);
}