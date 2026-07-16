from abc import ABC, abstractmethod

class BankConfig:
    """Singleton holding shared settings like interest rate and overdraft limit."""
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, interest_rate=0.05, overdraft_limit=1000):
        if self._initialized:
            return
        self.interest_rate = interest_rate
        self.overdraft_limit = overdraft_limit
        self._initialized = True

    @classmethod
    def instance(cls):
        return cls()

class AccountObserver(ABC):
    @abstractmethod
    def update(self, event, account, **data):
        ...


class SMSAlert(AccountObserver):
    def update(self, event, account, **data):
        if event == "deposit":
            print(f"[SMS -> {account.owner}] Deposit of {data['amount']} received. "
                  f"New balance: {account.balance}")
        elif event == "withdraw":
            print(f"[SMS -> {account.owner}] Withdrawal of {data['amount']} processed. "
                  f"New balance: {account.balance}")


class AuditLog(AccountObserver):
    def __init__(self):
        self.entries = []

    def update(self, event, account, **data):
        entry = f"AUDIT: acct={account.number} event={event} data={data} balance={account.balance}"
        self.entries.append(entry)
        print(entry)

class Account:
    def __init__(self, owner,number, balance):
        self.owner = owner
        self.number = number
        self.__balance = balance
        self._observers = []
    @property
    def balance(self):
        return self.__balance
    def subscribe(self, observer):
        self._observers.append(observer)
    def _notify(self, event, **data):
        for observer in self._observers:
            observer.update(event, self, **data)
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance +=amount
        self._notify("deposit", amount=amount)
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("insufficient fund")
        self.__balance -= amount
        self._notify("withdraw", amount=amount)
    def _adjust_balance(self, amount):
        self.__balance += amount
    def statement(self):
        print("_"*40)
        print(f"Account Holder: {self.owner}")
        print(f"Account Number: {self.number}")
        print(f"Balance: {self.balance}")
        print("-"*40)
class SavingAccount(Account):
    def __init__(self, owner, number, balance=0, rate=None):
        super().__init__(owner, number, balance)
        self.rate = rate if rate is not None else BankConfig.instance().interest_rate
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
    def __init__(self, owner, number, balance=0, overdraft=None):
        super().__init__(owner, number, balance)
        self.overdraft = overdraft if overdraft is not None else BankConfig.instance().overdraft_limit
    def withdraw(self, amount):
        if amount < 0:
            raise ValueError("Amount must be positive")
        
        if amount > self.balance + self.overdraft:
            raise ValueError("Overlimit")
        self._adjust_balance(-amount)
        self._notify("withdraw", amount=amount)
    def statement(self):
        print("CURRENT ACCOUNT")
        super().statement()
        print(f"Overdraft Limit: {self.overdraft}")
        print("-"*40)


class AccountFactory:
    _registry = {
        "basic": Account,
        "savings": SavingAccount,
        "current": CurrentAccount,
    }

    @classmethod
    def create(cls, kind, owner, number, balance=0, **kwargs):
        key = kind.lower()
        if key not in cls._registry:
            raise ValueError(f"Unknown account kind: {kind}")
        account_cls = cls._registry[key]
        return account_cls(owner, number, balance, **kwargs)

if __name__ == "__main__":
    BankConfig(interest_rate=0.05, overdraft_limit=1000)

    audit_log = AuditLog()
    sms_alert = SMSAlert()

    Bank_Account = [
        AccountFactory.create("basic", "Abebe", 100076892323, 8000),
        AccountFactory.create("savings", "Bekele", 100098475987, 9000, rate=0.15),
        AccountFactory.create("current", "Abel", 10000512451, 1000),
    ]

    for account in Bank_Account:
        account.subscribe(audit_log)
        account.subscribe(sms_alert)
        account.deposit(10)
        account.withdraw(400)
        account.statement()
