from abc   import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model
    def describe(self):
        print(f"Current {self.make} {self.model}")
    @abstractmethod
    def wheels(self):
        pass
class Car(Vehicle):
    def __init__(self, make, model):
        super().__init__(make, model)
    def wheels(self):
        return 2
class Truck(Vehicle):
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity = capacity
    def describe(self):
        super().describe()
        print(f"Capacity of {self.capacity}tons")
    def wheels(self):
        return 3
    
vehicle = [
    Car("Tesla", "Model 1"),
    Truck("Ford", "F-150", 1.4),
    Car("BMW", "M4"),
    Truck("Volvo", "FH16", 25)
    ]

for vehicle in vehicle:
   vehicle.describe()