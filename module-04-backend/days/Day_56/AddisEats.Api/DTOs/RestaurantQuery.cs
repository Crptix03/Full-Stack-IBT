namespace AddisEats.Api.DTOs;

public class RestaurantQuery
{
    public string? Address { get; set; }
    public string? Name { get; set; }
    public bool? IsActive { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 3;
}