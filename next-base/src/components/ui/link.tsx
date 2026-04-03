"use client";
import NextLink, { type LinkProps } from "next/link";
import { useState } from "react";

type CustLink = LinkProps & {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function Link({
  href,
  prefetch = false,
  children,
  className,
  target,
  rel,
  ...rest
}: CustLink) {
  const [active, setActive] = useState(false);

  return (
    <NextLink
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      {...rest}
      className={className}
      target={target || "_self"}
      rel={rel || target == "_blank" ? "noopener noreferrer" : undefined}
    >
      {children}
    </NextLink>
  );
}
