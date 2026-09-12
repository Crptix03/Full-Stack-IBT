import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Cart from "./Cart/Cart";
import OrderHistory from "./OrderHistory/OrderHistory";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Layout>
  );
}