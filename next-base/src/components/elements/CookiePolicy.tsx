"use client";
import { Button } from "@/components/ui/button";
import { hasCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";

const CookiePolicy = () => {
  const [showConsent, setShowConsent] = useState<boolean>(true);

  useEffect(() => {
    setShowConsent(hasCookie("localConsent"));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9] flex items-center justify-between bg-gray-100 px-4 py-8">
      <span className="text-dark mr-16 text-base">
        This website uses cookies to improve user experience. By using our
        website you consent to all cookies in accordance with our Cookie Policy.
      </span>
      <Button
        className="rounded bg-green-500 px-8 py-2 text-white"
        onClick={() => acceptCookie()}
      >
        Accept
      </Button>
    </div>
  );
};

export default CookiePolicy;
