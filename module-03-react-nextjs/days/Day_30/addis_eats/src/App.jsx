import Menu from "./Menu";
import Header from "./Header";
import CheckoutPanel from "./CheckoutPanel";
import { CartProvider } from "./cart/CartProvider";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div>
          <Header />
          <main>
            <h2>Our Menu</h2>
            <Menu />
            <CheckoutPanel />
          </main>
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;