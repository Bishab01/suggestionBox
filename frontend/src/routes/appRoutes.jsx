import '../styles/index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import App from '../App';
import Home from '../pages/home';
import Dashboard from '../pages/admin/dashboard';
import NewsForm from '../pages/admin/newsForm';
import ProtectedRoute from "./protectedRoute";

function Approutes() {
  return (
    <Routes>
      {/* Auth page */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      

      <Route element={<App />}>
        {/* Open to all */}
         <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<Orders />} /> */}

        {/* {/* Open to customers }
        <Route path="/cart" element={<CustomerOnlyRoute><Cart /></CustomerOnlyRoute>} />
        <Route path="/checkout" element={<CustomerOnlyRoute><Checkout /></CustomerOnlyRoute>} />

        {/* Open to retailer }
        <Route path="/productsRetailer" element={<RetailerRoute><AdminProducts /></RetailerRoute>} /> */}
        {/* <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} /> */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/publish_news" element={<NewsForm />} />
      </Route>
    </Routes>
  );
}

export default Approutes;