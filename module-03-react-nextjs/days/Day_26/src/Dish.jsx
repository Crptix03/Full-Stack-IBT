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
