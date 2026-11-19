using Day_53.Models;

MenuItem item1 = new MenuItem(1, "Burger", "Food", 5.99m);
Console.WriteLine($"Menu Item: {item1.Name}, Category: {item1.Category}, Price: {item1.Price}, Price with VAT: {item1.PriceWithVat}");

List<MenuItem> myMenuItems = new List<MenuItem>
{
    new MenuItem(1, "Cheeseburger", "Main Course", 8.99m),
    new MenuItem(2, "Caesar Salad", "Appetizer", 5.49m),
    new MenuItem(3, "Chocolate Cake", "Dessert", 4.99m),
    new MenuItem(4, "Grilled Salmon", "Main Course", 12.99m),
    new MenuItem(5, "French Fries", "Side Dish", 2.99m),
    new MenuItem(6, "Lemonade", "Beverage", 1.99m),
    new MenuItem(7, "Spaghetti Bolognese", "Main Course", 9.49m)
};

//// LINQ Queries

// 1. WHERE Clause

//var foodItems = myMenuItems.Where(i => i.Category =="Main Course"); // where is equvalent to map in javascript

//foreach (var item in foodItems)
//{
//    Console.WriteLine($"Food Item Name: {item.Name}");
//}

// 2. SELECT Clause
//var prices = myMenuItems.Select(i => i.Price).ToList(); // select - when we want to select a specific property from the our class or object and also ToList() is that sometimes our data might not be in a list format so we can use ToList() to convert it into a list.

//foreach (var price in prices)
//{
//    Console.WriteLine($"Price: {price:C}"); 
//}

// we can combine the WHERE and SELECT clauses together to filter and select specific properties from our data. For example, we can use the WHERE clause to filter the menu items by category and then use the SELECT clause to select only the names of those items.

//// 3. ANY Clause
//bool hasExpensiveItems = myMenuItems.Any(i => i.Price > 10.0m);
//Console.WriteLine($"Has expensive items: {hasExpensiveItems}");

//// 4. ALL Clause
//bool allItemsAreExpensive = myMenuItems.All(i => i.Price > 10.0m);
//Console.WriteLine($"All items are expensive: {allItemsAreExpensive}");

// Any returns at least one item that matches the condition, while All returns true only if all items match the condition. If there are no items in the collection, Any will return false, while All will return true.

//5. FIRST and FIRSTORDEFAULT Clause 

//var d = myMenuItems.FirstOrDefault(i => i.Price > 10.0m)
//        ??
//        throw new InvalidOperationException("No item found with price greater than 10.0");

//if (d != null)
//{
//    Console.WriteLine($"First item with price greater than 10.0: {d.Name}");
//}
//else
//{
//    Console.WriteLine("No item found with price greater than 10.0");
//}


//// 6. ORDERBY and ORDERBYDESCENDING Clause
//var orderedByPrice = myMenuItems.OrderBy(i => i.Price).ToList();

//foreach (var item in orderedByPrice)
//{
//    Console.WriteLine($"Ordered by Price: {item.Name} - {item.Price:C}");
//}

//Console.WriteLine("--------------------------------------------------");

//var orderedByDesPrice = myMenuItems.OrderByDescending(i => i.Price).ToList();

//foreach (var item in orderedByDesPrice)
//{
//    Console.WriteLine($"Ordered by Price: {item.Name} - {item.Price:C}");
//}

//OrderBy is asending or whereas orderbydescending is self explatory

////7.SKIP and TAKE

//var theLast4Items = myMenuItems.Skip(3).Take(4).ToList();
//Console.WriteLine(theLast4Items.Count);

// 8. SUM and AVERAGE Clause
//var sumOfPrices = myMenuItems.Sum(i => i.Price);
//var averageOfPrices = myMenuItems.Average(i => i.Price);

//Console.WriteLine($"Sum of Prices: {sumOfPrices:C}, Average of Prices: {averageOfPrices:C}");



















////Console.WriteLine("Hi my name is John");

//////Console.WriteLine("Hi my name is Jane");

//////int x = 29;
//////decimal m = 10.5m;
//////bool isTrue = true;
//////string name = "John Doe";
//////char letter = 'A';
//////DateTime now = DateTime.Now;
//////Console.WriteLine(now);

//////int a = 120;
//////int b = a;
//////Console.WriteLine(a);
//////Console.WriteLine(b);


//////var n = new List<string>();
//////n.AddRange(new[] { "John", "Jane", "Doe" });

//////Console.WriteLine(n.Count);

//////for (int i = 0; i < n.Count; i++)
//////{
//////    Console.WriteLine($" Hello, {n[i]}");
//////}

//////foreach (var names in n)
//////{
//////    Console.WriteLine($"Hello there, {names}");
//////}

//////string? name = "John Doe";
//////Console.WriteLine(name ?? "No Name");

//////Console.WriteLine("What is your name?");
//////var username = Console.ReadLine();

//////Console.WriteLine($"Hello, {username}");

//////string u = "ccc";

//////if (int.TryParse(u, out int s))
//////{
//////    Console.WriteLine($"Parsed: {s}");
//////}
//////else
//////{
//////    Console.WriteLine("Failed to parse.");
//////}

//////var tot = 100;
//////switch (tot)
//////{
//////    case < 50:
//////        Console.WriteLine("Less than 50");
//////        break;
//////    case > 50:
//////        Console.WriteLine("Greater than 50");
//////        break;
//////    default:
//////        Console.WriteLine("Equal to 50");
//////        break;
//////}

//////var result = tot switch
//////{
//////    < 50 => "You're result is Less than 50",
//////    > 50 => "You're result is Greater than 50",
//////    _ => "You're result is Equal to 50"
//////};
//////Console.WriteLine(result);


////void Add(decimal a, decimal b)
////{
////    Console.WriteLine(a+b);
////}

////Add(10.5m, 20.5m);

////decimal CalculateVat(decimal price, decimal vatRate = 0.15m)
////{
////    return price * vatRate;
////}
////Console.WriteLine(CalculateVat(100m));
////Console.WriteLine(CalculateVat(100m, 0.2m));

////decimal CalculateBonus(decimal salary, decimal bonusRate, bool isManager=false)
////{
////   if(isManager)
////    {
////        return salary * bonusRate * 2;
////    }
////    else
////    {
////        return salary * bonusRate;
////    }
////}

////Console.WriteLine(CalculateBonus(5000m, 0.4m));
////Console.WriteLine(CalculateBonus(5000m, 0.4m, true));

////decimal subtract(decimal a, decimal b) => a - b;
////Console.WriteLine(subtract(10.5m, 5.5m));