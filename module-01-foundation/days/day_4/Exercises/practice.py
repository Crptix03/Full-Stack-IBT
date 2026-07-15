#Book Class: 
class Book:
    def __init__ (self, title, author, page):
      self.title = title
      self.author = author
      self.page = page
    def describe(self):
      print(f"{self.title} by {self.author}, {self.page} pages")
dune = Book("Dune", "Frank", 412)
harry_poter = Book("Harry Poter", "J.K Rowling", 500)
dune.describe()
harry_poter.describe()

#Product Class, Making The quantity private and validate the qantity to not make it go below zero

class Product:
    def __init__(self, name, price, quantity):
      self.name = name
      self.price = price
      self.__quantity= quantity
    @property
    def quantity(self):
      return self.__quantity
    @quantity.setter
    def quantity(self, value):
      if value <0:
         raise ValueError("No negative quantity")
      self.__quantity = value
    def restock(self, amount):
      if amount > 0:
        self.__quantity += amount
      else:
        print("Amount must be positive")
    def sell(self, amount):
      if amount > self.quantity:
        print(f"can not sell {amount} units - only {self.qantity} in stock.")
        return
      self.__quantity -=amount
    def statment(self):
      print(f"{self.name} cost {self.price}ETB, and we have {self.quantity}")
aa = Product("samsungnote10+", 44000, 69 ,)
aa1 = Product("iphone 17 pro max", 209000, 44, )

print("Before Change")
aa.statment()
aa1.statment()

aa.restock(-5)
aa.sell(10)

print("After Changeing aa Only")

aa.statment()
aa1.statment()
#Prove Independance

