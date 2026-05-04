import { Navigate, useLocation } from 'react-router';
import Login from '@/components/admin/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';
import GestionClubes from '@/components/admin/GestionClubes';
import GestionPartidos from '@/components/admin/GestionPartidos';
import RegistroResultados from '@/components/admin/RegistroResultados';
import GestionNoticias from '@/components/admin/GestionNoticias';
import GestionEstadisticas from '@/components/admin/GestionEstadisticas';
import GestionAdmins from '@/components/admin/GestionAdmins';
import GestionJugadores from '@/components/admin/GestionJugadores';
import { useLigaCCM } from '@/hooks/useLigaCCM';

export default function Admin() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin' || location.pathname === '/admin/';

  const {
    clubes, partidos, noticias, auth, estadisticas,
    login, logout,
    agregarClub, editarClub, eliminarClub,
    programarPartido, eliminarPartido, registrarResultado, resetPartido,
    agregarNoticia, editarNoticia, eliminarNoticia,
    getClubById,
    editarEstadisticas,
    agregarAdmin, eliminarAdmin, getAdmins,
    agregarJugador, eliminarJugador, editarJugador,
  } = useLigaCCM();

  // Si no está autenticado y no está en la página de login, redirigir
  if (!auth.isAuthenticated && !isLoginPage) {
    return <Navigate to="/admin" replace />;
  }

  // Si está autenticado y está en la página de login, redirigir al dashboard
  if (auth.isAuthenticated && isLoginPage) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Página de login
  if (isLoginPage) {
    return <Login login={login} />;
  }

  // Panel de administración con rutas hijas
  return (
    <AdminLayout auth={auth} logout={logout}>
      {location.pathname === '/admin/dashboard' && (
        <Dashboard
          clubes={clubes}
          partidos={partidos}
          estadisticas={estadisticas}
          noticias={noticias}
          getClubById={getClubById}
        />
      )}
      {location.pathname === '/admin/clubes' && (
        <GestionClubes
          clubes={clubes}
          agregarClub={agregarClub}
          editarClub={editarClub}
          eliminarClub={eliminarClub}
        />
      )}
      {location.pathname === '/admin/partidos' && (
        <GestionPartidos
          clubes={clubes}
          partidos={partidos}
          programarPartido={programarPartido}
          eliminarPartido={eliminarPartido}
          getClubById={getClubById}
        />
      )}
      {location.pathname === '/admin/resultados' && (
        <RegistroResultados
          partidos={partidos}
          registrarResultado={registrarResultado}
          resetPartido={resetPartido}
          getClubById={getClubById}
          clubes={clubes}
        />
      )}
      {location.pathname === '/admin/tabla' && (
        <GestionEstadisticas
          clubes={clubes}
          estadisticas={estadisticas}
          editarEstadisticas={editarEstadisticas}
        />
      )}
      {location.pathname === '/admin/noticias' && (
        <GestionNoticias
          noticias={noticias}
          agregarNoticia={agregarNoticia}
          editarNoticia={editarNoticia}
          eliminarNoticia={eliminarNoticia}
        />
      )}
      {location.pathname === '/admin/admins' && (
        <GestionAdmins
          auth={auth}
          agregarAdmin={agregarAdmin}
          eliminarAdmin={eliminarAdmin}
          getAdmins={getAdmins}
        />
      )}
    </AdminLayout>
  );
}
