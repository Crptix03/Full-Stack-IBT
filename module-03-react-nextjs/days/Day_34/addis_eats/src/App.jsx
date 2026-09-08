import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Menu from "./Menu";
import DishDetail from "./DishDetail";
import CartPage from "./CartPage";
import SignIn from "./SignIn";
import NotFound from "./NotFound";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./ErrorBoundary";
import "./App.css";

const Checkout = lazy(() => import("./checkout/Checkout"));

function RouteSkeleton() {
  return <p className="route-skeleton">Loading...</p>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <ErrorBoundary fallback={<p className="boundary-fallback">Something went wrong loading the menu. Please refresh.</p>}>
                    <Menu />
                  </ErrorBoundary>
                }
              />
              <Route path="menu" element={<Menu />} />
              <Route path="menu/:id" element={<DishDetail />} />
              <Route
                path="cart"
                element={
                  <ErrorBoundary fallback={<p className="boundary-fallback">Something went wrong loading your cart. Please refresh.</p>}>
                    <CartPage />
                  </ErrorBoundary>
                }
              />
              <Route path="signin" element={<SignIn />} />
              <Route
                path="checkout"
                element={
                  <RequireAuth>
                    <ErrorBoundary fallback={<p className="boundary-fallback">Couldn't load checkout. Please refresh or try again.</p>}>
                      <Suspense fallback={<RouteSkeleton />}>
                        <Checkout />
                      </Suspense>
                    </ErrorBoundary>
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;