from collections import deque

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
class Branch:
    def __init__(self, name):
        self.name = name
        self.children = []
        self.accounts = []
    def total_balance(self):
        total = sum(a.balance for a in self.accounts)
        for child in self.children:
            total += child.total_balance()
        return total
transfer = {
    100076892323: [100098475987],
    100098475987: [10000512451],
    10000512451: [100076892323]
}
def bfs(graph, start):
    seen = {start}
    q = deque([start])
    while q:
        acc = q.popleft()
        for recipient in graph.get(acc, []):
            if recipient not in seen:
                seen.add(recipient)
                q.append(recipient)
    return seen
