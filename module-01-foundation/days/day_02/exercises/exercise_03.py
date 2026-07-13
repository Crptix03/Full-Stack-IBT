# Exercise 3: While Loop Part A

balance = 500
while balance > 0:
   print("Your current balance is:", balance, "Birr")
   balance = balance - 100
   if balance <= 0:
       print("Your balance is now 0 Birr. You have no more funds available.")


# Exercise 3: For + Range Loop Part B
for i in range(1, 11):
    print(5 * i)


# Exercise 3: For + List + Continue Loop Part C
#names = ["Almaz", "Dawit", "Tigist", "Bereket"]
for name in ["Almaz", "Dawit", "Tigist", "Bereket"]:
    if name == "Tigist":
         continue
    print("Hello, ",name)


# Exercise 3: For Loop Part D

for i in range(1, 20):
    if i % 7 != 0:
        print(i)
    if i % 7 == 0:
        break