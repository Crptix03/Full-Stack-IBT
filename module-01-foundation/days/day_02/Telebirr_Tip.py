friends =[
    ("Abebe", 2500),
    ("Kebede", 3000),
    ("Alemu", 2800),
    ("Mekonnen", 3500),
    ("Tadesse", 2700)
]


print("Total balance:", sum(total_friend_balance for _, total_friend_balance in friends), "ETB", "Total number of friends:", len(friends))
def split_bill(Total,friends, tip_rate=0.15):
    return Total + (Total * tip_rate)
print("Total bill with tip:", split_bill(sum(total_friend_balance for _, total_friend_balance in friends), friends), "ETB")
print("Total amount per person:", split_bill(sum(total_friend_balance for _, total_friend_balance in friends), friends) / len(friends), "ETB")
print("list of friends and each friend's share of the bill:")
for name, balance in friends:
    share = split_bill(sum(total_friend_balance for _, total_friend_balance in friends), friends) / len(friends)
    print(f"Name: {name}, Share: {share} ETB")