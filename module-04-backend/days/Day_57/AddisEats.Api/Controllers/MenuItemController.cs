using AddisEats.Api.Models;
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Services.MenuItemServices;

namespace Day_54.AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class  MenuItemController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;
    public MenuItemController(IMenuItemService menuItemService)
    {
        _menuItemService = menuItemService;
    }


    [HttpGet]
    public IActionResult GetAll([FromQuery] string? category)
    {
        var result = _menuItemService.GetAll(category);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var result = _menuItemService.GetById(id);

        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    //[HttpGet("{query}")]    
    //public IActionResult GetAll([FromQuery] string? category)
    //{
    //    var result = _menuItemService.GetByQuery(category);
    //    return Ok(result);
    //}
}