"use client";

import authApiRequest from "@/apiRequest/auth";
import {
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  getRefreshTokenFromLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const publicPaths = ["/login", "/register", "/refresh-token"];

export default function RefreshToken() {
  const pathName = usePathname();
  useEffect(() => {
    if (publicPaths.includes(pathName)) return;

    let interval = null;
    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      // Thời điểm hết hạn của token là tính theo epoch time (s)
      // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
      const now = new Date().getTime() / 1000;
      // trường hợp refresh token hết hạn thì cho logout
      if (decodedRefreshToken.exp <= now) return;
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkAndRefreshToken();
    interval = setInterval(checkAndRefreshToken, 1000);
    return () => clearInterval(interval);
  }, [pathName]);
  return null;
}
