// cspell:ignore Resizer
"use client";
import { isSmallScreenAtom } from "@/atoms";
import { useAtom } from "jotai";
import { PropsWithChildren, useEffect } from "react";

export const Resizer = ({ children }: PropsWithChildren) => {
  const [isSmallScreen, setIsSmallScreen] = useAtom(isSmallScreenAtom);
  const handleResize = (setIsSmallScreen: any, _e?: UIEvent) => {
    setIsSmallScreen(window.innerWidth <= 960 ? true : false);
  };
  useEffect(() => {
    if (isSmallScreen && window.innerWidth <= 960) setIsSmallScreen(true);
    if (isSmallScreen && window.innerWidth > 960) setIsSmallScreen(false);
  }, [isSmallScreen, setIsSmallScreen]);
  useEffect(() => {
    window.addEventListener(
      "resize",
      handleResize.bind(window, setIsSmallScreen)
    );
    return () =>
      window.addEventListener(
        "resize",
        handleResize.bind(window, setIsSmallScreen)
      );
  }, []);
  return <>{children}</>;
};
