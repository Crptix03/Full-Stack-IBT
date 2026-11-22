using AddisEats.Api.Services.MenuItemServices;
using AddisEats.Api.Services.RestaurantServices;
using AddisEats.Api.Services.OrderServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;

    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IMenuItemService, MenuItemService>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderServices>();

////////////
var thePhoneNumber = builder.Configuration.GetValue<string>("data:Contact:Phone");
Console.WriteLine($"The phone number is: {thePhoneNumber}");
////////////
///

// Adding CORS CONFIG
builder.Services.AddCors(options =>
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:3000")   // Vite
              .AllowAnyHeader()
              .AllowAnyMethod()));



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("frontend");

app.MapControllers();

app.Run();
