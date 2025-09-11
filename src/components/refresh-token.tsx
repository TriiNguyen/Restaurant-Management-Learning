"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicPaths = ["/login", "/register", "/refresh-token"];

export default function RefreshToken() {
  const pathName = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (publicPaths.includes(pathName)) return;

    let interval: any = null;

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            console.log("call logout");
            clearInterval(interval);
            router.push("/login");
          },
        }),
      1000
    );
    return () => clearInterval(interval);
  }, [pathName, router]);
  return null;
}
