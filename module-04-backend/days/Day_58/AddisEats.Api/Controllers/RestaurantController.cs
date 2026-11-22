using AddisEats.Api.Services.RestaurantServices;
using AddisEats.Api.Mappers;
using AddisEats.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;

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

    [HttpGet("{id:int:min(1)}")]
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
    public IActionResult GetAllRestaurants([FromQuery] RestaurantQuery query)
    {
        var restaurant = _restaurantService.GetAll(query);
        return Ok(restaurant ); 
    }

    [HttpGet("active")]
    public IActionResult GetAllActiveRestaurants()
    {
        var restaurant = _restaurantService.GetAllActive();
        var restaurantDTOs = restaurant.Select(r => r.ToDTO()).ToList();
        return Ok(restaurantDTOs); 
    }
}