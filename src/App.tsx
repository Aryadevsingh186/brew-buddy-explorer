
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderForm from "./pages/OrderForm";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QRScanner from "./pages/QRScanner";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";

// Layouts
import AppLayout from "./components/layouts/AppLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminProtectedRoute from "./components/layouts/AdminProtectedRoute";

// Context providers
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageCoffees from "./pages/admin/ManageCoffees";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Admin routes - protected by role */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/coffees" element={<ManageCoffees />} />
              </Route>

              {/* App routes */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/order" element={<OrderForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/scan" element={<QRScanner />} />
                <Route path="/locations" element={<MapView />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
