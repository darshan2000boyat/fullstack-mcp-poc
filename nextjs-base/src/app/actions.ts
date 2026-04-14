"use server";

import { cookies } from "next/headers";

export const updateSplashScreenCookie = async () => {
  (await cookies()).set("VISITED", "1");
};
