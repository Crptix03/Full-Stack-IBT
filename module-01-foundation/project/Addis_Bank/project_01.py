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
        self.history = []
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
        self.history.append(("deposit", amount))
        self._notify("deposit", amount=amount)
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("insufficient fund")
        self.__balance -= amount
        self.history.append(("Withdraw", amount))
        self._notify("withdraw", amount=amount)
    def _adjust_balance(self, amount):
        self.__balance += amount
    def undo_last(self):
        if not self.history:
            print(f"No transaction to undo  for account {self.number}")
            return None 
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
        self.history.append(("Withdraw", amount))
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
class AccountRegistry:
    def __init__(self):
        self.by_number = {}
        self.order = []
    def add(self, acc):
        self.by_number[acc.number] = acc
        self.order.append(acc.number)
    def find(self, number):
        return self.by_number.get(number)
    def list_all(self):
        return [self.by_number[number] for number in self.order]
    def undo_last(self, number):
        acc = self.find(number)
        if acc is None:
            print (f"No account found with number {number}")
            return None
        return acc.undo_last()
    def top_by_balance(self, n=5):
        accts = sorted(self.by_number.values(), key=lambda a: a.balance, reverse=True)
        return accts[:n]
    def binary_search(self, item,targets):
        lower_I = 0
        higher_I = len(item) - 1
        while lower_I <= higher_I:
            mid = (lower_I + higher_I) // 2
            if item[mid] == targets:
                print(f"Iteam found at index {mid}")
                return mid
            elif item[mid] < targets:
                lower_I = mid + 1
            else:
                higher_I = mid - 1
        return -1
    def find_by_number(self, number):
        nums = sorted(self.by_number)
        i = self.binary_search(nums, number)
        return self.by_number.get(nums[i]) if i >= 0 else None
    def total_transactions(self, number):
        acc = self.find(number)
        if acc is None:
            return 0
        amount  = [amt for (_type, amt) in acc.history]
        return self._sum_amount(amount)
    def _sum_amount(self, amount):
        if not amount:
            return 0 
        return amount[0] + self._sum_amount(amount[1:])
if __name__ == "__main__":
    BankConfig(interest_rate=0.05, overdraft_limit=1000)

    audit_log = AuditLog()
    sms_alert = SMSAlert()
    registry = AccountRegistry()

    Bank_Account = [
        AccountFactory.create("basic", "Abebe", 100076892323, 8000),
        AccountFactory.create("savings", "Bekele", 100098475987, 9000, rate=0.15),
        AccountFactory.create("current", "Abel", 10000512451, 1000),
        
    ]

    for account in Bank_Account:
        account.subscribe(audit_log)
        account.subscribe(sms_alert)
        registry.add(account)
        account.deposit(10)
        account.withdraw(400)
        account.statement()
print("\n=== list_all() in insertion order ===")
for acc in registry.list_all():
    print(f"{acc.number} - {acc.owner} - balance: {acc.balance}")
print("\n=== undo_last() demo on Abebe's Account===")
registry.undo_last(100076892323)
registry.find(100076892323).statement()
print("\n=== total_transactions demo ===")
print(registry.total_transactions(100076892323))