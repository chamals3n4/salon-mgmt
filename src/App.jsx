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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <StackedLayout>
              <Routes>
                <Route path="/dashboard/" element={<Overview />} />
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
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
