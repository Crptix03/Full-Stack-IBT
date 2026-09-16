import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Home from "./Home/Home";
import ScrollToHash from "./ScrollToHash";
import RequireAuth from "./RequireAuth";
import RequireAdmin from "./admin/RequireAdmin";
import ErrorBoundary from "./ErrorBoundary";
import PageSkeleton from "./ui/PageSkeleton";

// ── Lazy-loaded routes (split out of the main bundle) ──
const Menu = lazy(() => import("./Menu/Menu"));           
const Favorites = lazy(() => import("./Menu/Favorites"));
const Cart = lazy(() => import("./Cart/Cart"));
const Checkout = lazy(() => import("./Checkout/Checkout"));
const OrderConfirmation = lazy(() => import("./Checkout/OrderConfirmation"));
const OrderHistory = lazy(() => import("./OrderHistory/OrderHistory"));
const SignIn = lazy(() => import("./Auth/SignIn"));
const SignUp = lazy(() => import("./Auth/SignUp"));
const Profile = lazy(() => import("./Auth/Profile"));

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const DishManager = lazy(() => import("./admin/DishManager"));
const OrderManager = lazy(() => import("./admin/OrderManager"));
const UserManager = lazy(() => import("./admin/UserManager"));

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
    <ErrorBoundary>
      <Routes>
        {/* ── Customer side ── */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route
            path="/menu"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                  <Menu />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/favorites"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                  <Favorites />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/cart"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                  <Cart />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <ErrorBoundary>
                  <Suspense fallback={<PageSkeleton />}>
                    <Checkout />
                  </Suspense>
                </ErrorBoundary>
              </RequireAuth>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <RequireAuth>
                <Suspense fallback={<PageSkeleton />}>
                  <OrderConfirmation />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Suspense fallback={<PageSkeleton />}>
                  <Profile />
                </Suspense>
              </RequireAuth>
            }
          />
          <Route
            path="/order-history"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <OrderHistory />
              </Suspense>
            }
          />
          <Route
            path="/signin"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <SignIn />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <SignUp />
              </Suspense>
            }
          />
        </Route>

        {/* ── Admin side ── */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Suspense fallback={<PageSkeleton />}>
                <AdminLayout />
              </Suspense>
            </RequireAdmin>
          }
        >
          <Route index element={<Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense>} />
          <Route path="dishes" element={<Suspense fallback={<PageSkeleton />}><DishManager /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageSkeleton />}><OrderManager /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<PageSkeleton />}><UserManager /></Suspense>} />

          <Route path="reports" element={<Navigate to="/admin" replace />} />
          <Route path="inventory" element={<Navigate to="/admin" replace />} />
          <Route path="categories" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}