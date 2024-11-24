import { Toaster } from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/api";
import { CurrentUserContextProvider } from "@/contexts/CurrentUserContext";

export const RootEntry: React.FunctionComponent = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const authenticatedUser = await auth.checkAuth();
      setBootstrapping(false);
      setCurrentUser(authenticatedUser);
      if (
        !authenticatedUser &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/welcome"
      ) {
        navigate({ to: "/sign-in" });
      }
    };
    bootstrap();
  }, [location, auth, navigate]);

  if (bootstrapping) {
    return null;
  }

  return (
    <CurrentUserContextProvider value={currentUser}>
      <Toaster />
      <Outlet />
    </CurrentUserContextProvider>
  );
};
