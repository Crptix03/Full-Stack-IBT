using AddisEats.Api.Services.RestaurantServices;
using AddisEats.Api.Mappers;
using AddisEats.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]

public class RestarutantController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;
    
    public RestarutantController(IRestaurantService RestaurantService)
    {
        _restaurantService = RestaurantService;
    }

    [HttpGet("{id}")]
    public IActionResult GetRestaurantById(int id)
    {
        var restaurant = _restaurantService.GetById(id);
        if (restaurant == null)
        {
            return NotFound();
        }
        else
        {
            return Ok(restaurant);
        }
    }

    [HttpGet()]
    public IActionResult GetAllRestaurants([FromQuery]string? address, [FromQuery] int page = 1, [FromQuery] int pageSize = 3)
    {
        var restaurant = _restaurantService.GetAll(address, page, pageSize);
        var restaurantDTOs = restaurant.Select(r => r.ToDTO()).ToList();
        return Ok(restaurantDTOs); 
    }
}