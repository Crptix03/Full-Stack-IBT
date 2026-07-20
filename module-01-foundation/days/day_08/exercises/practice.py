#Recursive sum

def countdown(n):
    if n == 0:
        return print("Lift off!")
    else:  
        print(n, "seconds")
        countdown(n-1)

countdown(10)
print(countdown)

#Binary search

def binary_sort(item, targets):
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
binary_sort_result = binary_sort([400,700,800,900], 700)
print(binary_sort_result)
#Merge sort

def merge_sort(iteams):
    if len(iteams) <=1:
        return iteams
    mid = len(iteams)//2
    left = merge_sort(iteams[:mid])
    right = merge_sort(iteams[mid:])
    
def merge(left, right):
    result = [] 
    while left and right:
        if left[0] <= right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    return result + left + right

aa = sorted([21,81,11,1,32])
print(aa)

#Sort with key

Accounts = [
    ("abebe", 500),
    ("bekele", 1500),
    ("melaku", 600),
    ("murtesa", 100),
    ("beamlak", 1000)
]
sorted_Accounts = sorted(Accounts, key=lambda x: x[1], reverse=True)
print(sorted_Accounts)

#Two pointers

def has_pairs(numbers, targets):
    lower_I = 0
    higher_I = len(numbers)-1
    while lower_I < higher_I:
        s = numbers[lower_I] + numbers[higher_I]
        if s ==targets:
            return True
        elif s < targets:
            lower_I += 1
        else:
            higher_I -= 1
    return False
aaa = [22,45,77,88]
result = has_pairs(aaa, 67)
print(result)