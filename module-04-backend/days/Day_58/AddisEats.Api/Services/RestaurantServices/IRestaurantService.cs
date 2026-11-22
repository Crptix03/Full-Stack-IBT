using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Services.RestaurantServices;

public interface IRestaurantService
{
    Restaurant? GetById(int id);
    PaginatedResultDTO<RestaurantDTO> GetAll(RestaurantQuery query);
    List<Restaurant> GetAllActive();
}