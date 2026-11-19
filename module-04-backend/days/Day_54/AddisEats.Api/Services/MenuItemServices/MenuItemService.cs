using AddisEats.Api.Models;

namespace AddisEats.Api.Services.MenuItemServices;

public class MenuItemService : IMenuItemService
{
    private readonly List<MenuItem> _menuItems = new()
    {
        new MenuItem { Id = 1, Name = "Burger", Description = "Delicious beef burger", Category = "", Price = 5.99m },
        new MenuItem { Id = 2, Name = "Pizza", Description = "Cheesy pizza with toppings", Category = "Main Course", Price = 8.99m },
        new MenuItem { Id = 3, Name = "Salad", Description = "Fresh garden salad", Category = "Salad", Price = 4.99m },
        new MenuItem { Id = 4, Name = "Pasta", Description = "Italian pasta with sauce", Category = "Main Course", Price = 7.99m },
        new MenuItem { Id = 5, Name = "Sushi", Description = "Fresh sushi rolls", Category = "Main Course", Price = 12.99m },
    };

    public List<MenuItem> GetAll(string? category)
    {
        return _menuItems
            .Where(x => category == null || x.Category == category)
            .ToList();
    }
    public MenuItem? GetById(int id)
    {
        return _menuItems.Where(x => x.Id == id).FirstOrDefault();
    }
    //public List<MenuItem> GetByQuery(string? category)
    //{   
    //    var items = _menuItems
    //        .Where(x => category == null || x.Category == category)
    //        .ToList();
        
    //    return items;
    //}
}

