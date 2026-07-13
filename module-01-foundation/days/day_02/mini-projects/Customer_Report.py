customers =[
    ("Abebe", 2500),
    ("Kebede", 300),
    ("Alemu", 580),
    ("Mekonnen", 3500),
    ("Tadesse", 270)
]


print("Total TeleBirr balance:", sum(total_customers_balance for _, total_customers_balance in customers), "ETB", "Total number of TeleBirr Customers:", len(customers))
def tier(balance):
    if balance >= 1000:
        return "Premium."
    elif balance >= 500:
        return "Standard."
    else:
        return "Basic."

print("list of customers, each customer's tier and their corresponding balance:")
for name, balance in customers:
    print(f"Name: {name}, Balance: {balance} ETB, Tier: {tier(balance)}")

print("Total number of premium customers:", sum(1 for _, balance in customers if balance >= 1000))
print("Total number of standard customers:", sum(1 for _, balance in customers if 500 <= balance < 1000))
print("Total number of basic customers:", sum(1 for _, balance in customers if balance < 500))