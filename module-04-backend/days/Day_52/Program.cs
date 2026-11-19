//Console.WriteLine("Hi my name is John");

//Console.WriteLine("Hi my name is Jane");

//int x = 29;
//decimal m = 10.5m;
//bool isTrue = true;
//string name = "John Doe";
//char letter = 'A';
//DateTime now = DateTime.Now;
//Console.WriteLine(now);

//int a = 120;
//int b = a;
//Console.WriteLine(a);
//Console.WriteLine(b);


//var n = new List<string>();
//n.AddRange(new[] { "John", "Jane", "Doe" });

//Console.WriteLine(n.Count);

////for (int i =0; i< n.Count; i++)
////{
////    Console.WriteLine($" Hello, {n[i]}");
////}

//foreach (var names in n)
//{
//    Console.WriteLine($"Hello there, {names}");
//}

//string? name = "John Doe";
//Console.WriteLine(name ?? "No Name");

//Console.WriteLine("What is your name?");
//var username = Console.ReadLine();

//Console.WriteLine($"Hello, {username}");

//string u = "ccc";

//if (int.TryParse(u, out int s))
//{
//    Console.WriteLine($"Parsed: {s}");
//}
//else
//{
//    Console.WriteLine("Failed to parse.");
//}

//var tot = 100;
//switch (tot)
//{
//    case < 50:
//        Console.WriteLine("Less than 50");
//        break;
//    case > 50:
//        Console.WriteLine("Greater than 50");
//        break;
//    default:
//        Console.WriteLine("Equal to 50");
//        break;
//}

//var result = tot switch
//{
//    < 50 => "You're result is Less than 50",
//    > 50 => "You're result is Greater than 50",
//    _ => "You're result is Equal to 50"
//};
//Console.WriteLine(result);

Console.WriteLine("Welcome to AddisEats Mobile Topup Service!");
Console.WriteLine("Enter your name:");
string userName = Console.ReadLine();

Console.WriteLine("-------Choose a Mobile network provider------");
Console.WriteLine("1. Ethiotelecom");
Console.WriteLine("2. Safaricom");


int choice = int.Parse(Console.ReadLine());
decimal topupAmount = 0;
decimal bounusAmount = 0;
Console.WriteLine("Please enter your phone number:");
int phoneNumber = int.Parse(Console.ReadLine());
Console.WriteLine("Enter Topup Amount:");
while (topupAmount <= 0 || topupAmount > 5000)
{
    if (decimal.TryParse(Console.ReadLine(), out topupAmount))
    {
        if (topupAmount <= 0)
        {
            Console.WriteLine("Topup amount must be greater than zero.");
        }
        else if (topupAmount > 5000)
        {
            Console.WriteLine("Topup amount exceeds the maximum limit of 5000.");
        }
        else if (topupAmount > 1000)
        {
            bounusAmount += 20;
        }
    }

}

switch (choice)
{
    case 1:
        bounusAmount = topupAmount * 5 / 100;
        break;
    case 2:
        bounusAmount = topupAmount * 3 / 100;
        break;
    default:
        bounusAmount = 0;
        break;
}
Console.Clear();
Console.WriteLine("\n");
Console.WriteLine(" ******Thank you for using AddisEats Mobile Topup Service!******");
Console.WriteLine($"*Name: {userName}");
Console.WriteLine($"*Topup Amount: {topupAmount:N2} ETB");
Console.WriteLine($"*Bonus Amount: {bounusAmount:N2} ETB");
Console.WriteLine($"*Total Amount: {topupAmount + bounusAmount:N2} ETB");
Console.WriteLine($"*Phone Number: {phoneNumber}");
Console.WriteLine("****************************************************************");