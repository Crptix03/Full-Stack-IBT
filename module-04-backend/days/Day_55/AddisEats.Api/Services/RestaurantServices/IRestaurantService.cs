using AddisEats.Api.Models;

namespace AddisEats.Api.Services.RestaurantServices;

public interface IRestaurantService
{
    Restaurant? GetById(int id);
    List<Restaurant> GetAll(string? address, int page, int pageSize);
    //List<Restaurant> Search();
}