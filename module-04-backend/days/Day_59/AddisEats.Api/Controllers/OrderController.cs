using AddisEats.Api.Services.OrderServices;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService OrderServices)
    {
        _orderService = OrderServices;
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var order = _orderService.GetById(id);
        if (order == null)
        {
            return NotFound();
        }
        return Ok(order);

    } 
    [HttpPost()]
    public IActionResult CreateOrder([FromBody] CreateOrderDTO createDTO)
    {
        var result = _orderService.CreateOrder(createDTO);

        if (!result.IsSuccess)
        {
            return Problem(title: result.Error?.Message, statusCode: result.Error?.Status, detail: result.Error?.Code);
        }

        var order = result.Value;
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }
}