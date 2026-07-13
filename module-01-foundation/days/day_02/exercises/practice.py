# Additional Exercise

# Temperature Classification

Temperature = int(input("Enter the temperature in Celsius: "))
if Temperature < 15:
        print(Temperature, "°C is Cold")
elif Temperature >= 15 and Temperature < 28:
        print(Temperature, "°C is Warm")
else:
        print(Temperature, "°C is Hot")

# Receipt Loop
for i in range(1,10):
        print("Receipt number:", i)

# Writing Even Numbers

for i in range(1, 20):
    if i % 2 == 0: 
        print(i, "is an even number")

# Displaying Functions

def apply_discount(price, percent=10):
    return price - (price * percent / 100)

print(apply_discount(1000))

# Count Down Loop Using While Loop

countdown = 5
while countdown > 0:
    print(countdown, "seconds")
    countdown -= 1

print("Lift off!")