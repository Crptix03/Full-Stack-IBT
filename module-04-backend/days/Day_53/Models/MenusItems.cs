using Day_53.Models;

namespace Day_53.Models
{
    public class MenuItem
    {
        public MenuItem(int id, string name, string category, decimal price)
        {
            Id = id;
            Name = name;
            Category = category;
            Price = price;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public decimal PriceWithVat => Price * 1.2m;
    }
}

////MenuItem item1 = new MenuItem(1, "Cheeseburger", "Main Course", 8.99m);
//MenuItem item1 = new MenuItem()
//{
//    Id = 1,
//    Name = "Cheeseburger",
//    Category = "Main Course",
//    Price = 8.99m
//};

//Console.WriteLine(item1.Name);