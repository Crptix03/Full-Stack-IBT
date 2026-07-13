stock = {}
try:
    with open("sq2-horenus-dessalegn\\module-01-foundation\\days\\day_03\\mini-project\\stock.txt") as f:
        for line in f:
            item, qty = line.strip().split(",")
            stock[item] = int(qty)
except FileNotFoundError:
    print("No stock file yet - starting emepty")

def adjust(item, amount):
    stock[item] = stock.get(item) + amount

low = [item for item, qty in stock.items() if qty < 10]
print("Low stock:", low)