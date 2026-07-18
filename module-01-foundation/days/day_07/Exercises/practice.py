#Naming the Big-O
# 1. List Indexing
# Big-O: O(1) - Accessing an element by index in a list is a constant time operation.
# 2. Single Loop
# Big-O: O(n) - A single loop that iterates through all elements in a list has linear time complexity.
# 3. Nested Loop
# Big-O: O(n^2) - A nested loop that iterates through all elements in a list for each element has quadratic time complexity.
# 4. Dictionary Lookup
# Big-O: O(1) - Looking up an element in a dictionary by its key is a constant time operation.
# 5. Binary Search
# Big-O: O(log n) - Binary search has logarithmic time complexity as it halves the search space with each iteration.

#2. List vs Dict Lookup

import time
list_of_account = [f"account_[i]" for i in range(100000)]
dict_of_account = {f"account_[i]" for i in range(100000)}
target = "account_99999"
start = time.perf_counter()
found  = target in list_of_account
end = time.perf_counter()
print(f"List search: {end -start:.8f} seconds")
stack = time.perf_counter
found = target in dict_of_account
end = time.perf_counter()
print(f"Dict search: {end - start:.8f} seconds")

#3. Stack And Queues

stack = ["apple", "banana", "carrots", "cabbag", "Onions"]
stack.append("white onion")
stack.pop(2)
print(stack)
top = stack[-1]
behind = stack.reverse()
print(top)
print(stack)

#4. Buld A Queue

from collections import deque
bank_service_line =["Abebe", "Bemnet", "Mike", "Horenus","Murtessa"]
q = deque(bank_service_line)
q.append("Bekele")
fist_served = q.popleft()
print(q)

#5 .Single Linked List

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
class LinkedList:
    def __init__(self):
        self.head = None
    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    def print_all(self):
        current = self.head
        while current is not None:
            print(current.data)
            current = current.next
acc_list = LinkedList()
acc_list.push_front("acc1")
acc_list.push_front("acc2")
acc_list.push_front("acc3")
acc_list.print_all()