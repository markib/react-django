import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import  { AuthProvider } from './context/AuthContext';
import DashboardTabs from './components/DashboardTabs';



function App() {
 
  return (
    <Router>  {/* Ensure the entire app is wrapped inside the Router */}
      <AuthProvider>  {/* Now AuthProvider is inside Router */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MainLayout>
            <Routes>
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardTabs />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;