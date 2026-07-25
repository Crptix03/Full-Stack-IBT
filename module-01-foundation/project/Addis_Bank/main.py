import os
from datetime import datetime

from accounts import BankConfig, AccountFactory, SMSAlert, AuditLog
from bank_model import AccountRegistry, Branch


class AddisBank:
    def __init__(self):
        self.registry = AccountRegistry()
        self.transactions = []
        self.config = BankConfig()
        self._next_number = 100000000001
        self.sms_alert = SMSAlert()
        self.audit_log = AuditLog()
        self.head_office, self.branches = self._build_branch_tree()
        self._seed_demo_accounts()


    def _build_branch_tree(self):
        addis_branch = Branch("Addis Ababa Branch")
        bahirdar_branch = Branch("Bahir Dar Branch")
        north_region = Branch("North Region")
        north_region.children = [addis_branch, bahirdar_branch]

        hawassa_branch = Branch("Hawassa Branch")
        jimma_branch = Branch("Jimma Branch")
        south_region = Branch("South Region")
        south_region.children = [hawassa_branch, jimma_branch]

        head_office = Branch("Head Office")
        head_office.children = [north_region, south_region]

        branches = {
            "1": addis_branch,
            "2": bahirdar_branch,
            "3": hawassa_branch,
            "4": jimma_branch,
        }
        return head_office, branches

    def _register_account(self, account, branch, wants_sms=True):
        account.subscribe(self.audit_log)
        self.registry.add(account)
        branch.accounts.append(account)

    def _seed_demo_accounts(self):
        demo_accounts = [
            ("basic", "Abebe", 8000, "1"),
            ("savings", "Bekele", 9000, "1"),
            ("current", "Abel", 1000, "2"),
            ("savings", "Chaltu", 5000, "3"),
            ("current", "Dawit", 3000, "4"),
        ]
        for kind, owner, balance, branch_key in demo_accounts:
            number = self._generate_account_number()
            account = AccountFactory.create(kind, owner, number, balance)
            self._register_account(account, self.branches[branch_key])

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    def get_input(self, prompt, input_type=str, validation=None):
        while True:
            raw = input(f"{prompt} (or 'cancel'): ").strip()
            if raw.lower() == "cancel":
                return None
            try:
                value = input_type(raw)
            except ValueError:
                print(f"Please enter a valid {input_type.__name__}.")
                continue
            if validation and not validation(value):
                print("That value isn't allowed. Try again.")
                continue
            return value

    def _generate_account_number(self):
        number = self._next_number
        self._next_number += 1
        return number

    def _display_type(self, account):
        names = {
            "Account": "BasicAccount",
            "SavingAccount": "SavingsAccount",
            "CurrentAccount": "CurrentAccount",
        }
        return names.get(type(account).__name__, type(account).__name__)

    def _log_transaction(self, number, kind, amount):
        self.transactions.append({
            "number": number,
            "type": kind,
            "amount": amount,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

    def _ask_and_send_sms(self, event, account, amount):
        choice = self.get_input(
            "Send SMS alert? (y/n)", str,
            lambda v: v.lower() in ("y", "n"),
        )
        if choice is None:
            print("SMS alert not sent (cancelled).")
            return
        if choice.lower() == "y":
            self.sms_alert.update(event, account, amount=amount)
            print("SMS alert sent successfully.")
        else:
            print("SMS alert not sent.")


    def show_menu(self):
        print("=" * 45)
        print("ADDIS BANK - MAIN MENU")
        print("=" * 45)
        print(" 1. Create account")
        print(" 2. View all accounts")
        print(" 3. Find account")
        print(" 4. Top accounts by balance")
        print(" 5. Deposit")
        print(" 6. Withdraw")
        print(" 7. Check balance")
        print(" 8. Transfer money")
        print(" 9. View transaction history")
        print("10. Add interest (Savings only)")
        print("11. View statistics")
        print("12. Branch tree overview")
        print("13. Undo last transaction")
        print(" 0. Exit")
        print("=" * 45)

    def run(self):
        actions = {
            "1": self.create_account,
            "2": self.view_all_accounts,
            "3": self.find_account,
            "4": self.top_accounts,
            "5": self.deposit_money,
            "6": self.withdraw_money,
            "7": self.check_balance,
            "8": self.transfer_money,
            "9": self.view_transactions,
            "10": self.add_interest,
            "11": self.view_statistics,
            "12": self.branch_tree_overview,
            "13": self.undo_transaction,
        }

        while True:
            self.clear_screen()
            self.show_menu()
            choice = input("Choose an option: ").strip()

            if choice == "0":
                print("Thank You For Choosing AddisBank!")
                break

            action = actions.get(choice)
            if action is None:
                input("Invalid option. Press Enter to try again...")
                continue

            print()
            try:
                action()
            except ValueError as e:
                print(f"Error: {e}")

            input("\nPress Enter to return to menu...")


    def create_account(self):
        print("1. Basic")
        print("2. Savings")
        print("3. Current")
        choice = self.get_input(
            "Account type", int,
            lambda v: v in (1, 2, 3),
        )
        if choice is None:
            return
        kind = {1: "basic", 2: "savings", 3: "current"}[choice]

        owner = self.get_input("Owner Full Name:", str, lambda v: len(v) > 0)
        if owner is None:
            return
        balance = self.get_input("Initial Deposite Amount", float, lambda v: v >= 0)
        if balance is None:
            return
        sms_choice = self.get_input(
            "Enable SMS alerts for this account? (y/n)", str,
            lambda v: v.lower() in ("y", "n"),
        )
        if sms_choice is None:
            return
        wants_sms = sms_choice.lower() == "y"

        print("1. Addis Ababa Branch")
        print("2. Bahir Dar Branch")
        print("3. Hawassa Branch")
        print("4. Jimma Branch")
        branch_choice = self.get_input(
            "Assign to which branch", str,
            lambda v: v in self.branches,
        )
        if branch_choice is None:
            return
        branch = self.branches[branch_choice]

        number = self._generate_account_number()
        account = AccountFactory.create(kind, owner, number, balance)
        self._register_account(account, branch, wants_sms)
        print(f"Account created.\n Account Number: {number}\n Full Name: {owner}\n Balance: {balance}\n Branch: {branch.name}")
        if wants_sms:
            print(f"[SMS -> {owner}] SMS alerts enabled for account {number}.")

    def view_all_accounts(self):
        accounts = self.registry.list_all()
        if not accounts:
            print("No accounts yet.")
            return
        total = 0
        for acc in accounts:
            print(f"{acc.number} - {acc.owner} ({self._display_type(acc)}) - balance: {acc.balance}")
            total += acc.balance
        print(f"\nTotal balance across all accounts: {total}")

    def find_account(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find_by_number(number)
        if account is None:
            print("Account not found.")
            return
        account.statement()

    def top_accounts(self):
        n = self.get_input("How many top accounts?", int, lambda v: v > 0)
        if n is None:
            return
        top = self.registry.top_by_balance(n)
        if not top:
            print("No accounts yet.")
            return
        for i, acc in enumerate(top, start=1):
            print(f"{i}. {acc.number} - {acc.owner} - balance: {acc.balance}")


    def deposit_money(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find(number)
        if account is None:
            print("Account not found.")
            return
        amount = self.get_input("Amount to deposit", float, lambda v: v > 0)
        if amount is None:
            return
        account.deposit(amount)
        self._log_transaction(number, "deposit", amount)
        self._ask_and_send_sms("deposit", account, amount)
        print(f"Deposited {amount} into account {number}. New balance: {account.balance}")

    def withdraw_money(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find(number)
        if account is None:
            print("Account not found.")
            return
        amount = self.get_input("Amount to withdraw", float, lambda v: v > 0)
        if amount is None:
            return
        account.withdraw(amount)
        self._log_transaction(number, "withdraw", amount)
        self._ask_and_send_sms("withdraw", account, amount)
        print(f"Withdrew {amount} from account {number}. New balance: {account.balance}")

    def check_balance(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find(number)
        if account is None:
            print("Account not found.")
            return
        print(f"Balance for {account.owner} ({number}): {account.balance}")
        if hasattr(account, "overdraft"):
            print(f"Overdraft limit: {account.overdraft}")
            print(f"Available to withdraw: {account.balance + account.overdraft}")

    def transfer_money(self):
        from_number = self.get_input("From account number", int)
        if from_number is None:
            return
        to_number = self.get_input("To account number", int)
        if to_number is None:
            return

        from_acc = self.registry.find(from_number)
        to_acc = self.registry.find(to_number)
        if from_acc is None or to_acc is None:
            print("Both accounts must exist.")
            return

        amount = self.get_input("Amount to transfer", float, lambda v: v > 0)
        if amount is None:
            return

        from_acc.withdraw(amount)
        to_acc.deposit(amount)
        self._log_transaction(from_number, "transfer_out", amount)
        self._log_transaction(to_number, "transfer_in", amount)
        print(f"Transferred {amount} from {from_number} to {to_number}.")

    def view_transactions(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find(number)
        if account is None:
            print("Account not found.")
            return

        related = [t for t in self.transactions if t["number"] == number]
        if not related:
            print("No transactions logged for this account.")
            return

        running = 0
        for t in related:
            if t["type"] in ("deposit", "transfer_in"):
                running += t["amount"]
            else:
                running -= t["amount"]
            print(f"[{t['timestamp']}] {t['type']} of {t['amount']} - running balance: {running}")


    def add_interest(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        account = self.registry.find(number)
        if account is None:
            print("Account not found.")
            return
        if not hasattr(account, "add_interest"):
            print("Interest only applies to savings accounts.")
            return
        account.add_interest()
        print(f"Interest applied. New balance: {account.balance}")

    def view_statistics(self):
        accounts = self.registry.list_all()
        if not accounts:
            print("No accounts yet.")
            return

        total_balance = sum(a.balance for a in accounts)
        average = total_balance / len(accounts)

        breakdown = {}
        for acc in accounts:
            kind = self._display_type(acc)
            breakdown[kind] = breakdown.get(kind, 0) + 1

        print(f"Total accounts: {len(accounts)}")
        print(f"Total balance: {total_balance}")
        print(f"Average balance: {average:.2f}")
        print("Account type breakdown:")
        for kind, count in breakdown.items():
            print(f"  {kind}: {count}")

    def branch_tree_overview(self):
        def show(branch, depth=0):
            print("  " * depth + f"{branch.name} - total balance: {branch.total_balance()}")
            for child in branch.children:
                show(child, depth + 1)

        show(self.head_office)

    def undo_transaction(self):
        number = self.get_input("Account number", int)
        if number is None:
            return
        result = self.registry.undo_last(number)
        if result:
            self.transactions.append({
                "number": number,
                "type": f"undo_{result[0]}",
                "amount": result[1],
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })


if __name__ == "__main__":
    bank = AddisBank()
    bank.run()