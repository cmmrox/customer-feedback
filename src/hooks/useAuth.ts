import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return {
    session,
    isAuthenticated,
    isLoading,
    isAdmin,
    logout,
    user: session?.user
  };
} 