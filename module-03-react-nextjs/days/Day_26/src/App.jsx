import Dish from "./Dish";
const menu = [
  {
  id: "001",
  name: "kitfo",
  price: 541
  },
  {
    id: "001",
    name: "shiro",
    price: 566
  },
  {
    id: "003",
    name: "kikl",
    price: 656
  }
]

function Header(){
  return(
    <div className="container">
      <h1> Royal Bistro </h1>

      <header>
        <nav className="nav">
          <a href="#home">Home</a>

          <a href="#contact">Contact</a>

        </nav>

        <p>Welcome To Royal Bistro Food Ordering App</p>

      </header>

    </div>

  )
}

function App() {
  return(
    <div>
      <Header />



      {
        menu.map( data =>
        (
          <Dish key= {data.id} name={data.name} price={data.price}/>
        )
        )
      }
    </div>

  )
}

export default App;