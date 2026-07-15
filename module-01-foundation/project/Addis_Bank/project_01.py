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
    def _adjust_balance(self, amount):
        self.__balance += amount
    def statement(self):
        print("_"*40)
        print(f"Account Holder: {self.owner}")
        print(f"Account Number: {self.number}")
        print(f"Balance: {self.balance}")
        print("-"*40)
class SavingAccount(Account):
    def __init__(self, owner, number, balance=0, rate=0.05):
        super().__init__(owner, number, balance)
        self.rate = rate
    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)
    def statement(self):
        self.add_interest()
        print("SAVINGS ACCOUNT")
        super().statement()
        print(f"Interest Rate: {self.rate}")
        print("-"*40)

class CurrentAccount(Account):
    def __init__(self, owner, number, balance=0, overdraft=1000):
        super().__init__(owner, number, balance)
        self.overdraft = overdraft
    def withdraw(self, amount):
        if amount < 0:
            raise ValueError("Amount must be positive")
        
        if amount > self.balance + self.overdraft:
            raise ValueError("Overlimit")
        self._adjust_balance(-amount)
    def statement(self):
        print("CURRENT ACCOUNT")
        super().statement()
        print(f"Overdraft Limit: {self.overdraft}")
        print("-"*40)

Bank_Account = [
   Account("Abebe", 100076892323, 8000),
   SavingAccount("Bekele", 100098475987, 9000, 0.15),
   CurrentAccount("Abel", 10000512451, 1000)
    ]
for account in Bank_Account:
    account.deposit(10)
    account.withdraw(400)
    account.statement()
