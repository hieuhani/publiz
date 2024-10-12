import { Toaster } from "react-hot-toast";
import { Outlet, redirect, useLocation } from "@tanstack/react-router";
import { SideBar } from "./SideBar";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const RootEntry: React.FunctionComponent = () => {
  const location = useLocation();
  const hideSideBar = location.pathname === "/sign-in";
  const auth = useAuth();
  const [bootstrapping, setBootstrapping] = useState(true);
  useEffect(() => {
    const bootstrap = async () => {
      const isAuthenticated = await auth.checkAuth();
      setBootstrapping(false);
      if (!isAuthenticated && location.pathname !== "/sign-in") {
        redirect({ to: "/sign-in" });
      }
    };
    bootstrap();
  }, []);

  if (bootstrapping) {
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen w-full">
        {!hideSideBar && <SideBar />}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};
