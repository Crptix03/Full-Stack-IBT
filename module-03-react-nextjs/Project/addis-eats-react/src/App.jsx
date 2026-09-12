import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import OrderHistory from "./OrderHistory/OrderHistory";
import ScrollToHash from "./ScrollToHash";

export default function App() {
  return (
    <Layout>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Layout>
  );
}