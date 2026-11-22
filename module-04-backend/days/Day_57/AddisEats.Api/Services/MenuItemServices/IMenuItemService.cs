using AddisEats.Api.Models;

namespace AddisEats.Api.Services.MenuItemServices;

public interface IMenuItemService
{
    List<MenuItem> GetAll(string? category);
    MenuItem? GetById(int id);
    //List<MenuItem> GetByQuery(string? category);
}