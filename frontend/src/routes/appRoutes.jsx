import '../styles/index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login'
import App from '../App';

function Approutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<Login/>}/>
      
      {/* <Route path="/signUp" element={<Signup/>}/>

      <Route element={<App />}>
        {/* Open to all}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/orders" element={<Orders />} />

        {/* Open to customers }
        <Route path="/cart" element={<CustomerOnlyRoute><Cart /></CustomerOnlyRoute>} />
        <Route path="/checkout" element={<CustomerOnlyRoute><Checkout /></CustomerOnlyRoute>} />

        {/* Open to retailer }
        <Route path="/dashboard" element={<RetailerRoute><Dashboard /></RetailerRoute>} />
        <Route path="/productsRetailer" element={<RetailerRoute><AdminProducts /></RetailerRoute>} />
      </Route> */}
    </Routes>
  );
}

export default Approutes;