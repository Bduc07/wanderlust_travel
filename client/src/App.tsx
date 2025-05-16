import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Packages from "@/pages/Packages";
import PackageDetails from "@/pages/PackageDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserDashboard from "@/pages/UserDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminPackages from "@/pages/AdminPackages";
import AdminBookings from "@/pages/AdminBookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "./context/AuthContext";

function Router() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/packages" component={Packages} />
          <Route path="/packages/:id" component={PackageDetails} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard">
            {user ? <UserDashboard /> : <Login />}
          </Route>
          <Route path="/admin">
            {isAdmin ? <AdminDashboard /> : <NotFound />}
          </Route>
          <Route path="/admin/packages">
            {isAdmin ? <AdminPackages /> : <NotFound />}
          </Route>
          <Route path="/admin/bookings">
            {isAdmin ? <AdminBookings /> : <NotFound />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
