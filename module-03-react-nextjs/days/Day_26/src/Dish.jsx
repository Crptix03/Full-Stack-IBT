function Dish({name, price}){
    return(
        <div className="Dishes">
            <h2>Our Menu</h2>
            <p>{name}</p>
            <p>{price} birr</p>
        </div>
    )
}
export default Dish;
// function Dish(props){
//     return(
//         <div className="Dishes">
//             <h2>Our Menu</h2>
//             <p>name: {props.name}</p>
//             <p>price: {props.price} birr</p>
//         </div>
//     )
// }
// export default Dish;