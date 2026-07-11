# Exercise 5: Create a list of tuples containing customer names and their corresponding account balances. Then, write a function that takes this list as input and returns the name of the customer with the highest balance.
customers = [
    ("Bemnet", 1000),
    ("Amanuel", 500),
    ("Mulu", 250),
    ("Saba", 750),]

def get_tier(customers):
    
    if customers >= 1000:
        return "premium, Congratulations! You are a premium customer"
    elif customers >= 500:
        return "Standard"
    else:
        return "Basic"

def apply_tax(balance, rate=0.15):
    return balance + (balance * rate)

for customer in customers:
    name, balance = customer
    get_tier(balance)
    apply_tax(balance)
    print(f"customer: {name}, {balance} ETB, {get_tier(balance)}, With tax: ${apply_tax(balance)} ETB")

total_customers = len(customers)
print("Total number of customers:", total_customers, "Combined balance of all customers:", sum(balance for _, balance in customers), "ETB")