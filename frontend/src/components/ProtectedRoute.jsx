import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserDataContext);
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;