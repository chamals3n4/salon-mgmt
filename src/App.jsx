import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StackedLayout from "./layouts/StackedLayout";

import Overview from "./pages/Overview";
import Project from "./pages/Project";
import Orders from "./pages/Orders";
import Packages from "./pages/Packages";
import Customers from "./pages/Customers";
import SingleCustomer from "./pages/SingleCustomer";

function App() {
  return (
    <Router>
      <StackedLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers/1" element={<SingleCustomer />} />
        </Routes>
      </StackedLayout>
    </Router>
  );
}

export default App;
