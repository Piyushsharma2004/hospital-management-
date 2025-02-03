"use client";

import { useEffect ,  useState} from "react";
import { useRouter } from "next/navigation";
import { checkAuth, getCurrentUser } from "@/lib/auth";
import MedicalChatbot from "@/components/Chatbot/chatbot";
import MLTrainingPopup from "@/components/alert/notification";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      router.push("/auth/signin"); // Redirect to sign-in if not authenticated
    }
  }, [router]);

  const user = getCurrentUser();

  return isAuthenticated ? (
    <div className="dashboard-layout">
       <MLTrainingPopup />
      <main>{children}</main>
      <MedicalChatbot />
    </div>
  ) : null; // Avoid rendering children if not authenticated
};

export default DashboardLayout;
