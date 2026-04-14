import { i18n } from "@/app/locales/i18n.config";
import { BreadcrumbTrail } from "@/components/elements/Breadcrumb";
import { ImageFragment, TLocale } from "@/typings/common";
import { SitemapPageData } from "@/typings/strapi";
import { ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
const qs = require("qs");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStrapiMedia = (
  imageData?: ImageFragment | string | null,
  format?: keyof ImageFragment["formats"],
) => {
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? "http://localhost:1343";

  // Handle string input
  if (typeof imageData === "string") {
    return imageData?.startsWith("/") ? `${baseUrl}${imageData}` : imageData;
  }

  // Extract media attributes
  //@ts-ignore
  const media = imageData;

  // Handle missing media
  if (!media) {
    return "/images/placeholder.png";
  }

  // Define format selection logic
  const getFormatUrl = () => {
    // If format is specified and exists, use it directly
    if (format && media.formats?.[format]?.url) {
      return media.formats[format].url;
    }

    // If format is specified but doesn't exist, try fallbacks based on format
    if (format) {
      const formats = media.formats || {};

      switch (format) {
        case "large":
          // If large was requested but doesn't exist, try smaller formats
          return media.url;

        case "medium":
          // If medium was requested but doesn't exist, try smaller formats
          return formats.large?.url ?? media.url;

        case "small":
          // If small was requested but doesn't exist, try thumbnail
          return formats.medium?.url ?? formats.large?.url ?? media.url;

        case "thumbnail":
          // If thumbnail was requested but doesn't exist, use original
          return (
            formats.small?.url ??
            formats.medium?.url ??
            formats.large?.url ??
            media.url
          );

        default:
          // For custom formats not in our standard sizes
          return media.url;
      }
    }

    // If no format specified, return original URL
    return media.url;
  };

  const finalUrl = getFormatUrl();

  // Handle URL prefixing
  return finalUrl.startsWith("/") ? `${baseUrl}${finalUrl}` : finalUrl;
};

export const queryToString = (query: { [key: string]: any }) => {
  return qs.stringify(query, {
    encodeValuesOnly: true,
  });
};

export const attachLocaleSuffix = (link: string = "", locale: TLocale) => {
  const suffix = locale !== i18n.defaultLocale ? `-${locale}` : "";
  return `${link}${suffix}`;
};

export const removeLocaleSuffix = (link?: string) => {
  if (typeof link !== "string") return link;

  const regex = new RegExp(`-(?:${i18n.locales.join("|")})$`, "i");
  const match = link?.match(regex);

  if (match) {
    const cleanedLink = link?.replace(match[0], "");
    return cleanedLink;
  }

  return link;
};

export const getSeoMedia = (
  imageData?: ImageFragment | ImageFragment | string,
  format?: keyof ImageFragment["formats"],
) => {
  // Reuse getStrapiMedia but override the placeholder image if media is missing
  const result = getStrapiMedia(imageData, format);

  // If the result is the placeholder image from getStrapiMedia, replace with SEO placeholder
  if (result === "/images/placeholder.png") {
    return "/images/logo_original.png";
  }

  return result;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateTrail = (
  currentPage?: SitemapPageData,
): BreadcrumbTrail[] => {
  if (!currentPage) return [];

  const currentTrail = {
    title: currentPage.PageTitle,
    link: removeLocaleSuffix(currentPage.PageURL),
    enabled: !currentPage.Disabled,
  };

  return [...generateTrail(currentPage.ParentPage), currentTrail];
};

export const generateTimes = () => {
  const times = [];
  const startTime = dayjs().startOf("day"); // Start from 12:00 AM (midnight)
  const endTime = startTime.clone().endOf("day"); // End at 11:30 PM

  for (
    let currentTime = startTime;
    currentTime.isBefore(endTime);
    currentTime = currentTime.add(30, "minute")
  ) {
    times.push({
      label: currentTime.format("hh:mm A"), // 12-hour format with AM/PM
      value: currentTime.format("HH:mm"), // 24-hour format
    });
  }

  return times;
};

export const getRouteURL = (
  slug: string,
  parentPage?: SitemapPageData,
): string => {
  // Base case: No parent page, just return the slug with leading slash
  if (!parentPage) {
    return `/${slug}`;
  }

  // Build the URL by recursively traversing up the parent hierarchy
  let urlParts: string[] = [slug];
  let currentPage: SitemapPageData | undefined = parentPage;

  // Traverse up through all parent pages
  while (currentPage) {
    if (currentPage.PageURL) {
      urlParts.unshift(currentPage.PageURL);
    }
    currentPage = currentPage.ParentPage;
  }

  // Join all parts with slashes and add leading slash
  return `/${urlParts.join("/")}`;
};

export function getVimeoThumbnailID(videoUrl: string): string | null {
  const regex = /\/playback\/(\d+)\//;
  const match = videoUrl.match(regex);
  const videoId = match?.[1];

  if (!videoId) return null;

  return videoId;
}

export const getTitleBreadcrumbs = (
  page: any,
): Array<{ title: string; url?: string }> => {
  if (!page) return [];

  // Get parent breadcrumbs first (recursively)
  const parentCrumbs = page.ParentPage
    ? getTitleBreadcrumbs(page.ParentPage)
    : [];

  // Add current page to the breadcrumb trail
  return [
    ...parentCrumbs,
    {
      title: page.PageTitle,
      url: page.PageURL,
    },
  ];
};
