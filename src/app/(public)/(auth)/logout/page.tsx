"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const { mutateAsync: logoutMutation } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get("refreshToken");
  useEffect(() => {
    if (refreshToken !== getAccessTokenFromLocalStorage()) return;
    const logout = async () => {
      await logoutMutation();
      router.push("/login");
    };
    logout();
  }, [logoutMutation, router, refreshToken]);
  return <div>LogoutPage</div>;
}
