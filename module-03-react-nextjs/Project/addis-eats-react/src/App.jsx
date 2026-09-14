import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import OrderConfirmation from "./Checkout/OrderConfirmation";
import OrderHistory from "./OrderHistory/OrderHistory";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import RequireAuth from "./RequireAuth";
import Profile from "./Auth/Profile";

import RequireAdmin from "./admin/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import InventoryManager from "./admin/InventoryManager";
import DishManager from "./admin/DishManager";
import CategoryManager from "./admin/CategoryManager";
import OrderManager from "./admin/OrderManager";
import SalesReports from "./admin/SalesReports";

export default function App() {
  return (
    <Routes>
      {/* Customer side */}
      <Route element={<Layout />}>
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
          path="/order-confirmation"
          element={
            <RequireAuth>
              <OrderConfirmation />
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
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<InventoryManager />} />
        <Route path="dishes" element={<DishManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="reports" element={<SalesReports />} />
      </Route>
    </Routes>
  );
}