#Transaction Log reader 
transactions = {}
try:
    with open("IBT\\sq2-horenus-dessalegn\\module-01-foundation\\days\\day_03\\Exercises\\transactions.txt")as  f:
        for line in f:
            print(line.strip())
    transactions = {}
    with open("IBT\\sq2-horenus-dessalegn\\module-01-foundation\\days\\day_03\\Exercises\\transactions.txt")as  f:
        for line in f:
            name, amount = line.strip().split(",")
            transactions[name] = int(amount)
        sorted_by_name  = sorted(transactions.items())
        sorted_by_amount = sorted(transactions.items(),key=lambda pair:pair[1], reverse=True)
        for name, amount in sorted_by_amount:
            print("This are the sorted names and their amount",name, amount)
except FileExistsError:
    print("The file is missing")