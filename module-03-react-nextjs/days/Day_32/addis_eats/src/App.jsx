import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import CartPage from "./CartPage";
import Checkout from "./Checkout";
import SignIn from "./SignIn";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Menu />} />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;