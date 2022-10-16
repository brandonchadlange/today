import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface ProtectedPageProps {
  children?: ReactNode;
}

const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const { data: auth, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return <>{status === "authenticated" && children}</>;
};

export default ProtectedPage;
