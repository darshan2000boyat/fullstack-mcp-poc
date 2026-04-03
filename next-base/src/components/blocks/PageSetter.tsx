"use client";

import { useApp } from "@/components/AppProvider";
import { useEffect } from "react";

const PageSetter = ({ darkHeader }: { darkHeader: boolean }) => {
  const { setIsDarkHeader } = useApp();

  useEffect(() => {
    setIsDarkHeader(darkHeader);

    return () => {
      setIsDarkHeader(false);
    };
  }, [darkHeader, setIsDarkHeader]);

  return <></>;
};

export default PageSetter;
