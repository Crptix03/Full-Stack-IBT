// import { useContext, useState } from "react";
// import PropTypes from "prop-types";
// import { ThemeContext } from "./context/ThemeContext";
// import Modal from "./ui/Modal";

// function Dish({ dish, onAdd }) {
//   const { theme } = useContext(ThemeContext);
//   const [modalOpen, setModalOpen] = useState(false);

//   // TEMPORARY — throw deliberately to test the ErrorBoundary, then delete this block
//   if (dish.name === "Crispy Sambusa") {
//     throw new Error("Deliberate test error in Dish");
//   }

//   return (
//     <div className={`dish dish--${theme}`}>
//       <button className="dish-name-btn" onClick={() => setModalOpen(true)}>
//         <h3>
//           {dish.name} {dish.spicy && <span className="badge">🌶 Spicy</span>}
//         </h3>
//       </button>
//       <p>{dish.price} ETB</p>
//       <div className="dish-actions">
//         <button onClick={() => onAdd(dish)}>Add</button>
//       </div>

//       <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
//         <h2>{dish.name}</h2>
//         <p className="dish-detail-price">{dish.price} ETB</p>
//         <p className="dish-detail-category">Category: {dish.category}</p>
//         {dish.spicy && <span className="badge">🌶 Spicy</span>}
//         <button
//           onClick={() => {
//             onAdd(dish);
//             setModalOpen(false);
//           }}
//         >
//           Add to cart
//         </button>
//       </Modal>
//     </div>
//   );
// }

// Dish.propTypes = {
//   dish: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     category: PropTypes.string,
//     spicy: PropTypes.bool,
//   }).isRequired,
//   onAdd: PropTypes.func.isRequired,
// };

// export default Dish;


import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "./context/ThemeContext";
import Modal from "./ui/Modal";

function Dish({ dish, onAdd }) {
  const { theme } = useContext(ThemeContext);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={`dish dish--${theme}`}>
      <button className="dish-name-btn" onClick={() => setModalOpen(true)}>
        <h3>
          {dish.name} {dish.spicy && <span className="badge">🌶 Spicy</span>}
        </h3>
      </button>
      <p>{dish.price} ETB</p>
      <div className="dish-actions">
        <button onClick={() => onAdd(dish)}>Add</button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{dish.name}</h2>
        <p className="dish-detail-price">{dish.price} ETB</p>
        <p className="dish-detail-category">Category: {dish.category}</p>
        {dish.spicy && <span className="badge">🌶 Spicy</span>}
        <button
          onClick={() => {
            onAdd(dish);
            setModalOpen(false);
          }}
        >
          Add to cart
        </button>
      </Modal>
    </div>
  );
}

Dish.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    spicy: PropTypes.bool,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Dish;