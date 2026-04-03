import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbTrail {
  title?: string;
  link?: string;
  enabled?: boolean;
}

interface BreadcrumbProps {
  trail?: BreadcrumbTrail[];
  className?: string;
  classNames?: {
    title?: string;
    link?: string;
    list?: string;
  };
}

const Breadcrumb = ({ trail, className, classNames }: BreadcrumbProps) => {
  const filteredTrail = trail?.filter((e) => !!e.title);

  const generateHref = (path: BreadcrumbTrail, index: number) => {
    const url =
      filteredTrail
        ?.slice(0, index)
        ?.map((e) => e?.link)
        ?.filter(Boolean)
        ?.join("/") || "";

    const pathLink = path?.link ? `/${path.link}` : "";
    const urlLink = url ? `/${url}` : "";

    return `${urlLink}${pathLink}`;
  };

  return (
    <div className={cn("text-mobster", className)}>
      <ul
        className={cn(
          "flex flex-wrap items-center text-ellipsis whitespace-nowrap",
          classNames?.list
        )}
      >
        <li className="text-breadcrumb inline-flex leading-tight">
          <Link
            className={cn(
              "link-underline after:bg-mobster hover:opacity-80",
              classNames?.link
            )}
            href={"/"}
          >
            Home
          </Link>
          {!!filteredTrail?.length ? <Separator /> : null}
        </li>
        {filteredTrail?.map((link, i) => {
          return (
            <li
              key={`link-${i}`}
              className={cn(
                "text-breadcrumb whitespace-break-spaces leading-tight",
                link?.link && !link?.enabled && "cursor-not-allowed"
              )}
            >
              {link.link ? (
                <>
                  {link?.enabled !== false ? (
                    <Link
                      className={cn(
                        "link-underline after:bg-mobster hover:opacity-80",
                        classNames?.link
                      )}
                      href={generateHref(link, i)}
                    >
                      {link.title}
                    </Link>
                  ) : (
                    link.title
                  )}
                  <Separator />
                </>
              ) : (
                link.title
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const Separator = () => {
  return <span className="mx-[0.8rem]">/</span>;
};

export default Breadcrumb;
