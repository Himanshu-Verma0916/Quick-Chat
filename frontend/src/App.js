import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
// import assets from './assets/assets'; // this has bgImage
import {ToastContainer} from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext'; // Assuming you have an AuthContext

const App = () => {
  const {authUser}=useContext(AuthContext);
  return (
    <div
      className="bg-contain"
      style={{ backgroundImage: `url("/bgImage.svg")` }}
    >
      <ToastContainer />
      <Routes>
        <Route path="/" element={authUser? <Home />: <Navigate to='/login'/>} />
        <Route path="/profile" element={authUser? <Profile />: <Navigate to='/login' />} />
        <Route path="/login" element={!authUser? <Login />: <Navigate to='/' />} />
      </Routes>
    </div>
  );
};

export default App;
