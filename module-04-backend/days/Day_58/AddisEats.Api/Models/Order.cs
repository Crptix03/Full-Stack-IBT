namespace AddisEats.Api.Models;

public class Order
{
    public int Id { get; set; }
    public int RestaurantId { get; set; }
    public int MenuItemId { get; set; }
    public string CoustomerName { get; set; }
    public string DelivaryAddress { get; set; }
    public string CustomerPhone { get; set; } 
    public int Quantity { get; set; } 
    public decimal TotalAmount { get; set; } 
}