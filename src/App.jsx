import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StackedLayout from "./layouts/StackedLayout";

import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import Project from "./pages/Project";
import Orders from "./pages/Orders";
import Packages from "./pages/Packages";
import Customers from "./pages/Customers";
import SingleCustomer from "./pages/SingleCustomer";
import Invoice from "./pages/Invoice";
import Login from "./pages/Login";

import ProtectedRoute from "./pages/ProtectedRoute";
import ViewInvoices from "./pages/ViewInvoices";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <StackedLayout>
                <Routes>
                  <Route path="/dashboard/" element={<Overview />} />

                  <Route
                    path="/dashboard/invoices"
                    element={<ViewInvoices />}
                  />
                  <Route path="/dashboard/invoice" element={<Invoice />} />
                  <Route path="/dashboard/customers" element={<Customers />} />
                  <Route path="/dashboard/packages" element={<Packages />} />
                  <Route path="/dashboard/projects" element={<Project />} />
                  <Route path="/dashboard/orders" element={<Orders />} />
                  <Route
                    path="/dashboard/customers/1"
                    element={<SingleCustomer />}
                  />
                </Routes>
              </StackedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
