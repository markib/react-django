import {  Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './styles/theme';
// import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AuthMiddleware from './middleware/Auth';
import Profile from './pages/Profile';
// import useAuth from './hooks/useAuth'; // Assuming you have this hook
import PersistLogin from './components/PersistLogin';
import Home from './pages/Home';
// import { AuthContextProvider } from './store/auth-context';
// import { BrowserRouter } from 'react-router-dom';
// import { RenderMenu, RenderRoutes } from './components/common/RenderNavigation';
// import { AuthWrapper } from './store/AuthWrapper';




function App() {
// const {user} = useAuth()
  // console.log(user);
  return <>
    <Navbar />
    <Routes>
      <Route path='/' element={<PersistLogin />}>
        <Route index exact element={<Home />}></Route>
        <Route path='/auth'>
          <Route path='login' element={<Login />}></Route>
          <Route path='register' element={<Register />}></Route>
          <Route path='profile' element={<AuthMiddleware />}>
            <Route index element={<Profile />}></Route>
          </Route>
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/' />}></Route>
    </Routes>
  </>
}

export default App;