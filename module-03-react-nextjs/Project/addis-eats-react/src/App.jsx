import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import OrderHistory from "./OrderHistory/OrderHistory";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import RequireAuth from "./RequireAuth";
import ScrollToHash from "./ScrollToHash";
import Profile from "./Auth/Profile";

export default function App() {
  return (
    <Layout>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Layout>
  );
}