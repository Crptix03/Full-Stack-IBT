#Uniqre Cities

cities = ["New York", "Los Angeles", "Chicago", "New York", "Los Angeles", "Houston"]
distinct_cities = set(cities)
print("Distinct cities:", distinct_cities)
print("Count of distinct cities:", len(distinct_cities))

#Price report.  
groceries = {
    "Brocolli": 650,
    "Appels": 200,
    "Bannas": 150,
    "Caroots": 300,
    "Cabbage": 100
}
for item, price in groceries.items():
    print(f"{item}: {price} ETB")

#Tax Cmprehension

Totals =[]
for price in[100,250,400,80]:
    Totals.append(price*0.15)
print("Tax Totals:", Totals)

#Cheap Iteams: 

cheap_items = [item for item, price in groceries.items() if price < 200]
print("Cheap items:", cheap_items)

#Write & Read:

with open("sq2-horenus-dessalegn\\module-01-foundation\\days\\day_03\\Exercises\\names.txt", "r") as file:
    for line in file:
       print(line.strip())

#Safe Division: 
try:
    amount = int(input("Amount: "))
    result = 1000 / amount
except ValueError:
    print("Please enter a number")
except ZeroDivisionError:
    print("Amount can't be zero")
else:
    print(result)
finally:
    print("Done")
