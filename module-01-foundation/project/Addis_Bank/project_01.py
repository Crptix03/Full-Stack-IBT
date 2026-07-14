class Account:
    def __init__(self, owner,number, balance):
        self.owner = owner
        self.number = number
        self.__balance = balance
    @property
    def balance(self):
        return self.__balance
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance +=amount
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("insufficient fund")
        self.__balance -= amount
    def statement(self):
        print(f"Name {self.owner} Account Number {self.number} Balance {self.__balance}")
Account1 = Account("Abebe", 100076892323, 8000) 
Account1.deposit(200)
Account1.withdraw(500)
Account1.statement()
    