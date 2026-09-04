import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./Layout";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import CheckoutPanel from "./CheckoutPanel";
import OrderForm from "./OrderForm";
import SignIn from "./SignIn";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartProvider";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function CartPage() {
  return (
    <div>
      <CheckoutPanel />
      <Link to="/checkout" className="proceed-link">
        Proceed to checkout →
      </Link>
    </div>
  );
}

function CheckoutPage() {
  return (
    <div>
      <CheckoutPanel />
      <OrderForm />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Menu />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:id" element={<DishDetail />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="signin" element={<SignIn />} />
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;