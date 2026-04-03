"use client";
import { CopyIcon } from "@/components/icons/CopyIcon";
import { FacebookIcon, XIcon } from "@/components/icons/Social";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SharePageProps {
  pageTitle: string;
}
const SharePage: React.FC<SharePageProps> = ({ pageTitle }) => {
  const { toast } = useToast();
  const pathname = usePathname();
  const FULL_URL = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`;

  const copyToClipboard = () => {
    console.log("here copy");
    navigator.clipboard.writeText(FULL_URL);
    toast({
      title: "Copied to clipboard",
    });
  };

  return (
    <div className="mb-20">
      <p className="mb-4">Share </p>
      <ul className="flex items-center gap-8">
        <li>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${FULL_URL}&t=${pageTitle}`}
            target="_blank"
          >
            <FacebookIcon className="size-8" />
          </Link>
        </li>
        <li>
          <Link
            href={`https://twitter.com/share?url=${FULL_URL}&text=${pageTitle}`}
            target="_blank"
          >
            <XIcon className="size-8" />
          </Link>
        </li>
        <li>
          <button onClick={copyToClipboard}>
            <CopyIcon className="size-8" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SharePage;
