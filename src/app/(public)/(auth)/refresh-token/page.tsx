"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get("refreshToken");
  const redirectUrl = searchParams.get("redirectUrl");
  useEffect(() => {
    if (refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectUrl || "/");
        },
      });
    } else {
      router.push("/");
    }
    return;
  }, [refreshToken, redirectUrl, router]);
  return <div>RefreshTokenPage</div>;
}
