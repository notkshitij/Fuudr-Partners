import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfileSetup from './pages/ProfileSetup';
import DashboardLayout from './pages/Dashboard/DashboardLayout';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/partner" replace />} />
        <Route path="/partner" element={<SignIn />} />
        <Route path="/partner/signup" element={<SignUp />} />
        <Route path="/partner/setup-profile" element={<ProfileSetup />} />
        <Route path="/partner/dashboard/*" element={<DashboardLayout />} />
        <Route path="/signup" element={<Navigate to="/partner/signup" replace />} />
        <Route path="/setup-profile" element={<Navigate to="/partner/setup-profile" replace />} />
        <Route path="/dashboard/*" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/partner" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
