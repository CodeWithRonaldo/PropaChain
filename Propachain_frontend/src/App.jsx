import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="property/:id" element={<PropertyDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
