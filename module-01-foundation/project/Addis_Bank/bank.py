from accounts import BankConfig, AuditLog, SMSAlert, AccountFactory
from bank_model import AccountRegistry, Branch, transfer, bfs

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
    addis_branch = Branch("Addis Ababa Branch")
    addis_branch.accounts = [Bank_Account[0], Bank_Account[1]]

    bahirdar_branch = Branch("Bahir Dar Branch")
    bahirdar_branch.accounts = [Bank_Account[2]]

    north_region = Branch("North Region")
    north_region.children = [addis_branch, bahirdar_branch]

    head_office = Branch("Head Office")
    head_office.children = [north_region]
    print(head_office.total_balance())


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
    print(bfs(transfer, 100076892323))