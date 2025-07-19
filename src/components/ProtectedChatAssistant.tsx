import React from "react";
import { ChatAssistant } from "@/components/ChatAssistant/ChatAssistant";
import { checkAuth } from "@/utils/auth";

export const ProtectedChatAssistant: React.FC = () => {
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    const verify = () => {
      const authenticated = checkAuth();
      setIsVerified(authenticated);

      if (!authenticated) {
        window.location.reload();
      }
    };

    verify();
    const interval = setInterval(verify, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVerified) {
    return null;
  }

  return <ChatAssistant />;
};
