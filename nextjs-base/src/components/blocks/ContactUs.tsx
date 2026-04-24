import { ContactInfoItem, ContactUsProps } from "@/typings/blocks";
import { Link } from "@/components/ui/link";
import ImageComponent from "@/components/ui/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons/Social";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getStrapiMedia } from "@/lib/utils";

const CONTACT_ICONS = {
  email: Mail,
  phone: Phone,
  timings: Clock,
  location: MapPin,
} as const;

const SOCIAL_ICONS: Record<
  string,
  (props: React.SVGProps<SVGSVGElement>) => JSX.Element
> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  twitter: XIcon,
};

function getSocialIcon(title?: string) {
  if (!title) return null;
  const key = title.trim().toLowerCase();
  return SOCIAL_ICONS[key] ?? null;
}

function getContactHref(item: ContactInfoItem) {
  if (item.Url) return item.Url;
  if (item.IconType === "email" && item.Value) return `mailto:${item.Value}`;
  if (item.IconType === "phone" && item.Value)
    return `tel:${item.Value.replace(/\s+/g, "")}`;
  return null;
}

function ContactRow({ item }: { item: ContactInfoItem }) {
  const Icon = CONTACT_ICONS[item.IconType] ?? Mail;
  const href = getContactHref(item);
  const valueClass = `h6 font-effra text-primary ${item.Underline !== false && href ? "underline underline-offset-[0.4rem]" : ""}`;

  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="flex items-center gap-[0.6rem] uppercase text-primary/60">
        <Icon className="h-[2rem] w-[2rem]" aria-hidden strokeWidth={1.75} />
        <span className="text-[1.4rem] font-bold leading-[1.1] tracking-[0.02em]">
          {item.Label}
        </span>
      </div>
      {href ? (
        <Link
          href={href}
          className={valueClass}
          target={item.Url?.startsWith("http") ? "_blank" : undefined}
        >
          {item.Value}
        </Link>
      ) : (
        <span className={valueClass}>{item.Value}</span>
      )}
    </div>
  );
}

export default function ContactUs({ block }: { block: ContactUsProps }) {
  const {
    Common,
    Heading,
    ContactItems = [],
    FollowUsLabel,
    SocialLinks = [],
    AddressImage,
    AddressLocationLabel,
    AddressText,
    AddressCTA,
    MapImage,
    MapLink,
    DecorativeImage,
  } = block || {};

  if (Common?.HideBlock) return null;

  const decorative = DecorativeImage?.Image;
  const address = AddressImage?.Image;
  const mapImg = MapImage?.Image;
  const decorativeSrc = decorative?.url ? getStrapiMedia(decorative) : null;
  const addressSrc = address?.url ? getStrapiMedia(address) : null;
  const mapSrc = mapImg?.url ? getStrapiMedia(mapImg) : null;

  return (
    <section
      id={Common?.BlockID || undefined}
      className="relative overflow-hidden bg-lightBlue-100 pb-[8rem] pt-[6rem] lg:pb-[14rem] lg:pt-[10rem]"
    >
      <div className="secPad-x relative mx-auto max-w-[144rem]">
        {decorativeSrc && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-6rem] top-[-2rem] hidden lg:block"
          >
            <ImageComponent
              src={decorativeSrc}
              alt=""
              width={decorative?.width || 600}
              height={decorative?.height || 800}
              className="h-auto max-h-[80rem] w-auto max-w-[60rem] rotate-[8deg] object-contain opacity-80 mix-blend-multiply"
              sizes="60rem"
            />
          </div>
        )}

        {/* Row 1: Heading + Contact info grid */}
        <div className="relative z-1 grid gap-[4rem] lg:grid-cols-[1fr_auto_1fr] lg:gap-x-[6rem]">
          <div className="flex flex-col gap-[3rem]">
            {Heading && <h1 className="h1 text-primary">{Heading}</h1>}
          </div>

          <div
            aria-hidden
            className="hidden w-px self-stretch bg-primary/20 lg:block"
          />

          {ContactItems.length > 0 && (
            <div className="flex flex-col gap-[3rem] lg:items-start lg:pt-[2rem]">
              {ContactItems.map((item, i) => (
                <ContactRow key={item.id ?? i} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Follow us row */}
        {(FollowUsLabel || SocialLinks.length > 0) && (
          <div className="relative z-1 mt-[4rem] flex flex-col gap-[1.6rem] lg:mt-[5rem]">
            {FollowUsLabel && (
              <p className="text-[1.4rem] font-bold uppercase leading-[1.1] tracking-[0.02em] text-primary">
                {FollowUsLabel}
              </p>
            )}
            {SocialLinks.length > 0 && (
              <ul className="flex items-center gap-[1.2rem]">
                {SocialLinks.map((social, i) => {
                  const Icon = getSocialIcon(social.Title);
                  if (!Icon || !social.url) return null;
                  return (
                    <li key={social.id ?? i}>
                      <Link
                        href={social.url}
                        target={
                          social.type === "external" ? "_blank" : undefined
                        }
                        aria-label={social.Title}
                        className="flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-full bg-lightBlue text-white transition-colors hover:bg-lightBlue-300"
                      >
                        <Icon className="h-[1.8rem] w-[1.8rem]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Row 2: Address card + Map */}
        <div className="relative z-1 mt-[5rem] grid gap-[2rem] lg:mt-[7rem] lg:grid-cols-[583fr_717fr] lg:gap-[2rem]">
          {/* Address card */}
          <div className="flex flex-col gap-[2rem] rounded-[3rem] bg-blue p-[2rem] text-white">
            {addressSrc && (
              <div className="relative aspect-[543/299] w-full overflow-hidden rounded-[3rem]">
                <ImageComponent
                  src={addressSrc}
                  alt={address?.alternativeText || AddressLocationLabel || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 991px) 100vw, 543px"
                />
              </div>
            )}
            <div className="flex flex-col gap-[3rem] px-[2rem] pb-[2rem] pt-[1rem]">
              <div className="flex flex-col gap-[1rem]">
                {AddressLocationLabel && (
                  <div className="flex items-center gap-[0.6rem] uppercase text-white/60">
                    <MapPin
                      className="h-[2rem] w-[2rem]"
                      aria-hidden
                      strokeWidth={1.75}
                    />
                    <span className="text-[1.4rem] font-bold leading-[1.1] tracking-[0.02em]">
                      {AddressLocationLabel}
                    </span>
                  </div>
                )}
                {AddressText && (
                  <p className="h6 whitespace-pre-line text-white">
                    {AddressText}
                  </p>
                )}
              </div>
              {AddressCTA?.url && AddressCTA?.Title && (
                <Link
                  href={AddressCTA.url}
                  target={AddressCTA.type === "external" ? "_blank" : undefined}
                  className="group inline-flex w-fit items-center gap-[1rem] rounded-full bg-lightBlue py-[1.2rem] pl-[2rem] pr-[1rem] text-[1.4rem] font-black uppercase leading-[1.2] tracking-[0.04em] text-white transition-colors hover:bg-lightBlue-300"
                >
                  {AddressCTA.Title}
                  <span
                    aria-hidden
                    className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white text-lightBlue transition-transform group-hover:translate-x-[0.2rem]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Map panel */}
          <div className="relative overflow-hidden rounded-[3rem] bg-white">
            {mapSrc ? (
              <ImageComponent
                src={mapSrc}
                alt={mapImg?.alternativeText || "Location map"}
                fill
                className="object-cover"
                sizes="(max-width: 991px) 100vw, 717px"
              />
            ) : (
              <div className="h-full min-h-[30rem] w-full bg-lightBlue-50" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {MapLink?.url ? (
                <Link
                  href={MapLink.url}
                  target={MapLink.type === "external" ? "_blank" : undefined}
                  aria-label={MapLink.Title || "Open map"}
                  className="flex h-[7.3rem] w-[6.8rem] items-center justify-center rounded-[2.4rem] border-[3px] border-white bg-lightBlue/60 text-white backdrop-blur-sm transition-colors hover:bg-lightBlue/80"
                >
                  <MapPin
                    className="h-[3.2rem] w-[3.2rem]"
                    aria-hidden
                    strokeWidth={2}
                  />
                </Link>
              ) : (
                <span
                  aria-hidden
                  className="flex h-[7.3rem] w-[6.8rem] items-center justify-center rounded-[2.4rem] border-[3px] border-white bg-lightBlue/60 text-white backdrop-blur-sm"
                >
                  <MapPin
                    className="h-[3.2rem] w-[3.2rem]"
                    aria-hidden
                    strokeWidth={2}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
