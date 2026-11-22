using AddisEats.Api.Data;
using AddisEats.Api.Models;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;

namespace AddisEats.Api.Services.RestaurantServices;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> allRestaurants = SeedData.restaurants;

    public Restaurant? GetById(int id)
    {
        return allRestaurants.Where(r => r.Id == id).FirstOrDefault();
    }

    public PaginatedResultDTO<RestaurantDTO> GetAll(RestaurantQuery query)
    {

        var restaurants = allRestaurants
            .Where(r => query.Address == null || r.Address == query.Address)
            .Where(r => query.Name == null || r.Name == query.Name)
            .Where(r => query.IsActive == null || r.IsActive == query.IsActive)
            .OrderBy(r => r.Name)
            .ToList();

        var totalCount = allRestaurants.Count();

        var toReturn = restaurants
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();

        PaginatedResultDTO<RestaurantDTO> resultDTO = new PaginatedResultDTO<RestaurantDTO>
        {
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize,
            Data = toReturn.Select(r => r.ToDTO()).ToList()
        };

        return resultDTO;

    }
    public List<Restaurant> GetAllActive()
    {
        var restaurants = allRestaurants
            .Where(r => r.IsActive == true)
            .OrderBy(r => r.Name)
            .ToList();

        return restaurants;
    }
}