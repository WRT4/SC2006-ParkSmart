import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthWrapper";

export default function Index() {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}
