#1. Spot the SPR violation
class Report:
    def __init__(self, title, data):
        self.title = title
        self.data = data
    def build(self):
        content = f"Report: {self.title}\n"
        for line in self.data:
            content += f"- {line}\n"
        return content
class ReportSaver:
    def save(self, content,filename):
        with open(filename, "w") as f:
            f.write(content)
        print(f"saved to {filename}")
class ReportMailer:
    def send(self, content,adress):
        print(f"Emailing report to {adress}...")
        print(content)
report = Report("Sales Q3", ["Revenue up 12%", "Churn down 3%"])
content = report.build()

ReportSaver().save(content, "report.txt")
ReportMailer().send(content, "boss@company.com")

#2. Refactor to OCP
class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    def area(self):
        return 3.14159 * self.radius ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    def area(self):
        return 0.5 * self.base * self.height

def print_area(shape):
    print(f"{type(shape).__name__} area: {shape.area()}")

print_area(Circle(4))
print_area(Square(5))
print_area(Triangle(3, 6))

#3. Write a Singleton
class AppSettings:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance
s1 = AppSettings()
s2 = AppSettings()
print(s1 is s2)          # True — same object
print(s1.currency, s2.currency)  
#4. Write a Factory
class ShapeFactory:
    _registry = {
        "circle": Circle,
        "square": Square,
        "triangle": Triangle,
    }

    @classmethod
    def create(cls, kind, *args, **kwargs):
        key = kind.lower()
        if key not in cls._registry:
            raise ValueError(f"Unknown shape: {kind}")
        return cls._registry[key](*args, **kwargs)
c = ShapeFactory.create("circle", 4)
sq = ShapeFactory.create("square", 5)
print(c.area(), sq.area())

#5. Write an Observer pair
class NewsAgency:
    def __init__(self):
        self._subscribers = []

    def subscribe(self, subscriber):
        self._subscribers.append(subscriber)

    def publish(self, headline):
        for sub in self._subscribers:
            sub.notify(headline)

class EmailSubscriber:
    def notify(self, headline):
        print(f"[Email] Breaking news: {headline}")

class SMSSubscriber:
    def notify(self, headline):
        print(f"[SMS] News alert: {headline}")


agency = NewsAgency()
agency.subscribe(EmailSubscriber())
agency.subscribe(SMSSubscriber())
agency.publish("Markets rally after rate cut")