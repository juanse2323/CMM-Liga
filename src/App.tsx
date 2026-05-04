import { Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { useLigaCCM } from './hooks/useLigaCCM'

export default function App() {
  const { auth } = useLigaCCM();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/admin" 
        element={auth.isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Admin />} 
      />
      <Route 
        path="/admin/dashboard" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/clubes" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/partidos" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/resultados" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/tabla" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/noticias" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/admin/admins" 
        element={auth.isAuthenticated ? <Admin /> : <Navigate to="/admin" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
