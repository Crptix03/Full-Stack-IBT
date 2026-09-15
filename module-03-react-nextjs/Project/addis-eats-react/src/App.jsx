import "./App.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Favorites from "./Menu/Favorites";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import OrderConfirmation from "./Checkout/OrderConfirmation";
import OrderHistory from "./OrderHistory/OrderHistory";
import SignIn from "./Auth/SignIn";
import SignUp from "./Auth/SignUp";
import RequireAuth from "./RequireAuth";
import ScrollToHash from "./ScrollToHash";
import Profile from "./Auth/Profile";

import RequireAdmin from "./admin/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import DishManager from "./admin/DishManager";
import OrderManager from "./admin/OrderManager";
import UserManager from "./admin/UserManager";

function CustomerLayout() {
  return (
    <Layout>
      <ScrollToHash />
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/favorites" element={<Favorites />} />
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
        <Route path="dishes" element={<DishManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="reports" element={<Navigate to="/admin" replace />} />
        <Route path="inventory" element={<Navigate to="/admin" replace />} />
        <Route path="categories" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}