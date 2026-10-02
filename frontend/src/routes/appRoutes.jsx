import '../styles/index.css';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import App from '../App';
import Home from '../pages/home';
import Dashboard from '../pages/admin/dashboard';
import NewsForm from '../pages/admin/newsForm';
import CommentsModeration from '../pages/admin/commentsModeration';
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

        {/* Admin only: everything inside is guarded once, here */}
        <Route element={<ProtectedRoute adminOnly><Outlet /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/publish_news" element={<NewsForm />} />
          <Route path="/admin/news/:nid/edit" element={<NewsForm />} />
          <Route path="/admin/comments" element={<CommentsModeration />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Approutes;