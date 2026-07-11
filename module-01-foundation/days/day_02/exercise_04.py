# Exercise 4: Function if it is even or odd part A

def is_even_or_odd(num):
    if num % 2 == 0:
        return "True"
    else:
        return "False"
for i in range(1, 10):
    print(i, "is", is_even_or_odd(i))

# Exercise 4: tax calculation part B

def add_tax(price, rate=0.15):
    return price + (price * rate)

# Exercise 4: tax calculation with example part C
print(add_tax(1000))
print(add_tax(1000, 0.10))

# Exercise 4: Function to check if the balance is Premium, Standard, or Basic part D
def describe_balance(balance):
    tier = 750
    if balance >= 1000:
        return "Premium"
    elif balance >= 500:
        return "Standard"
    else:
        return "Basic"
print(describe_balance(tier))

# The error in this code is that the variable 'tier' is defined inside the function describe_balance, but it is being used outside of the function. So the problem lies in the scope of global and local variables. In this case, tier is local variable where it should be a global variable and should be defined outside the function describe_balance.


