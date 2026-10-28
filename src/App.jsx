import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfileSetup from './pages/ProfileSetup';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Landing from './pages/Landing';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/setup-profile" element={<ProfileSetup />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
