import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");
  console.log("PrivateRoute: token check:", token);

  if (!token) {
    console.log("PrivateRoute: redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
