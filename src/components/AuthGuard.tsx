import React, { useState, useEffect } from "react";
import { checkAuth } from "@/utils/auth";
import { AuthModal } from "@/components/AuthModal";

interface AuthGuardProps {
  children: React.ReactNode;
  onAuthChange?: (authenticated: boolean) => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  onAuthChange,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    setShowAuthModal(!authenticated);
    setIsChecking(false);

    if (onAuthChange) {
      onAuthChange(authenticated);
    }
  }, [onAuthChange]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);

    if (onAuthChange) {
      onAuthChange(true);
    }
  };

  const requireAuth = () => {
    setIsAuthenticated(false);
    setShowAuthModal(true);

    if (onAuthChange) {
      onAuthChange(false);
    }
  };

  React.useImperativeHandle(
    React.useRef(),
    () => ({
      requireAuth,
    }),
    [],
  );

  if (isChecking) {
    return null;
  }

  return (
    <>
      <AuthModal opened={showAuthModal} onAuthenticated={handleAuthenticated} />
      {isAuthenticated && children}
    </>
  );
};

export const useAuthGuard = () => {
  const [authTrigger, setAuthTrigger] = useState(0);

  const requireReauth = () => {
    setAuthTrigger((prev) => prev + 1);
  };

  return { requireReauth, authTrigger };
};
