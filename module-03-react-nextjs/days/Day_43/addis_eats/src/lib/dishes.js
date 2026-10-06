export async function getDishes() {
  return [
    { 
      id: "d1", 
      name: "Crispy Sambusa", 
      price: 100, 
      category: "Starters",
      image: "/images/sambusa.webp",
    },
    { 
      id: "d2", 
      name: "Steak & Fries", 
      price: 3000, 
      category: "Mains",
      image: "/images/steak.jpg",
    },
    { 
      id: "d3", 
      name: "Big Smokey Burger", 
      price: 750, 
      category: "Mains",
      image: "/images/Big Smokey Burgers.jpg",
    },
    { 
      id: "d4", 
      name: "Honey Baklava", 
      price: 250, 
      category: "Desserts",
      image: "/images/Baklava2.jpg",
    },
  ];
}

export async function findDish(id) {
  const dishes = await getDishes();
  return dishes.find((d) => d.id === id) || null;
}