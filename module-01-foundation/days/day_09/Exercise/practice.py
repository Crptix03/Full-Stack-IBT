# Bulid a BST

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self. right = None
def insert(root, value):
        if root is None:
            return Node(value)
        if value < root.value:
            root.left = insert(root.left, value)
        else:
            root.right = insert(root.right, value)
        return root
def in_order(node):
    if node is None:
        return 
    in_order(node.left)
    print(node.value)
    in_order(node.right)
root = None
balances = [600, 400, 900, 100, 700]
for b in balances:
     root = insert(root, b)
in_order(root)

#Tree depth

def height(node):
    if node is None:
        return 0 
    return 1 + max(height(node.left), height(node.right))
root = None
balances = [500, 200, 800, 300, 1000]
for b in balances:
     root = insert(root, b)
print(height(root))

#Graph BFS

graph = {
    "Almaz": ["Dawit","Tigist","Samuel"],
    "Dawit": ["Almaz","Hanna"],
    "Tigist": ["Almaz","Samuel"],
    "Samuel": ["Almaz","Tigist","Hanna"],
    "Hanna": ["Dawit","Samuel"]
}
from collections import deque
def bfs(graph, start):
    seen = {start}
    order = [start]
    q = deque([start])
    while q:
        node = q.popleft()
        for n in graph[node]:
            if n not in seen:
                seen.add(n)
                order.append(n)
                q.append(n)
    return order
print(bfs(graph, "Almaz"))

#Graph DFS

graph = {
    "Almaz": ["Dawit","Tigist","Samuel"],
    "Dawit": ["Almaz","Hanna"],
    "Tigist": ["Almaz","Samuel"],
    "Samuel": ["Almaz","Tigist","Hanna"],
    "Hanna": ["Dawit","Samuel"]
}
from collections import deque
def dfs(graph, start, seen=None, order=None):
    if seen is None:
        seen = set()
        order = []
    seen.add(start)
    order.append(start)
    for n in graph[start]:
        if n not in seen:
            dfs(graph, n, seen, order)
    return order
print(dfs(graph, "Almaz"))

#Priority queue

import heapq
queue = []
heapq.heappush(queue, (1, "Rent"))
heapq.heappush(queue, (5, "Snacks"))
heapq.heappush(queue, (2, "Salary"))
heapq.heappush(queue, (4, "Meal prep"))
heapq.heappush(queue, (3, "Cloth"))
#heapq.heappop(queue)
print(heapq.heappop(queue))
print(queue)
print(heapq.heappop(queue))
print(queue)
print(heapq.heappop(queue))
print(queue)
print(heapq.heappop(queue))
print(queue)
print(heapq.heappop(queue))
print(queue)