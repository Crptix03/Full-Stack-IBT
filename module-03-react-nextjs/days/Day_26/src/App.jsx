import Dish from "./Dish";
/*=== Used in for Rendering an array of dishes with map, giving each a key. */
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
      {/* =====Write a Dish component that takes name and price props.=========*/}

      {/* <Dish id= "001" name= "kitfo" price= "541"/>
      <Dish id= "002" name= "shiro" price= "566"/>
      <Dish id= "003" name= "kikl" price= "656"/>  */}

      {/* ===== Render an array of dishes with map, giving each a key.======   */}

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