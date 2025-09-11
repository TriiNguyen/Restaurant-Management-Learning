"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const x = 1;

export default function LogoutPage() {
  const { mutateAsync: logoutMutation } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get("refreshToken");
  const accessToken = searchParams.get("accessToken");
  useEffect(() => {
    if (
      (refreshToken && refreshToken !== getAccessTokenFromLocalStorage()) ||
      (accessToken && accessToken !== getAccessTokenFromLocalStorage())
    )
      return;
    const logout = async () => {
      await logoutMutation();
      router.push("/login");
    };
    logout();
  }, [logoutMutation, router, refreshToken, accessToken]);
  return <div>LogoutPage</div>;
}
