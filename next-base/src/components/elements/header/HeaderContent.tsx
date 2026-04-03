"use client";
import { useApp } from "@/components/AppProvider";
import ImageComponent from "@/components/ui/image";
import AccessibilityMenu from "@/components/widgets/AccessibilityMenu";
import { cn } from "@/lib/utils";
import { IHeaderNavItem } from "@/typings/header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollLock } from "usehooks-ts";

export interface HeaderContentProps {
  className?: string;
  navItems: IHeaderNavItem[];
}

const HeaderContent = ({ navItems }: HeaderContentProps) => {
  const [showAccessibility, setShowAccessibility] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const accessibilityButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityMenuRef = useRef<HTMLDivElement>(null);

  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom",
  );
  const pathname = usePathname();
  const activePath = pathname.split("/");
  const { isDarkHeader } = useApp();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  const { accessibilityTrigger, isPageLoaded } = useApp();

  const { isLocked, lock, unlock } = useScrollLock({
    autoLock: false,
  });

  // Close accessibility menu when mega menu closes
  useEffect(() => {
    if (!isOpen) {
      setShowAccessibility(false);
      unlock();
    } else {
      lock();
    }
  }, [isOpen]);

  // Add click outside handler for accessibility menu
  useEffect(() => {
    if (!showAccessibility) return;

    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking the button itself
      if (
        accessibilityButtonRef.current &&
        accessibilityButtonRef.current.contains(event.target as Node)
      ) {
        return;
      }

      // Don't close if clicking inside the menu
      if (
        accessibilityMenuRef.current &&
        accessibilityMenuRef.current.contains(event.target as Node)
      ) {
        return;
      }

      // Otherwise, close the menu
      setShowAccessibility(false);
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccessibility]);

  const handleAccessibilityPosition = useCallback(() => {
    if (accessibilityButtonRef.current) {
      const buttonRect = accessibilityButtonRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // Approximate height of the dropdown in pixels
      const viewportHeight = window.innerHeight;

      // Check if there's enough space below the button
      const spaceBelow = viewportHeight - buttonRect.bottom;

      // If not enough space below, position above
      setDropdownPosition(spaceBelow < dropdownHeight ? "top" : "bottom");
    }
  }, []);

  useEffect(() => {
    handleAccessibilityPosition();
  }, [accessibilityTrigger, handleAccessibilityPosition]);

  // Accessibility toggle with position calculation
  const handleAccessibilityToggle = useCallback(() => {
    handleAccessibilityPosition();

    setShowAccessibility((prev) => !prev);
  }, [handleAccessibilityPosition]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-[9] w-screen transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } `}
      >
        <nav
          className={cn(
            "flex items-center justify-between bg-gray-300 p-4",
            isDarkHeader && "bg-red-700",
          )}
        >
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold text-white">
              <ImageComponent
                src="/images/logo.svg"
                alt="Logo"
                width={200}
                height={30}
              />
            </Link>
          </div>

          {/* Hamburger menu button for small screens */}
          <div className="block lg:hidden">
            <div className={`inline-block cursor-pointer`} onClick={toggleMenu}>
              <div
                className={`duration-400 mb-2 h-px w-10 bg-gray-700 transition-all ${
                  isOpen ? "translate-y-[0.6rem] -rotate-45" : null
                }`}
              ></div>
              <div
                className={`duration-400 mb-2 h-px w-10 bg-gray-700 transition-all ${
                  isOpen ? "opacity-0" : null
                }`}
              ></div>
              <div
                className={`duration-400 mt-2 h-px w-10 bg-gray-700 transition-all ${
                  isOpen ? "translate-y-[-0.6rem] rotate-45" : null
                }`}
              ></div>
            </div>
          </div>

          {/* Menu on the right */}
          <div className={`hidden lg:flex`}>
            <ul className="items-center justify-end space-x-4 lg:flex">
              {
                //@ts-ignore
                !navItems?.error &&
                  navItems?.map((item, i) => {
                    let active: boolean = false;

                    if (item.path == "/" && !activePath[2]) {
                      active = true;
                    } else if (
                      item.path !== "/" &&
                      activePath[1] &&
                      activePath[1] == item.path.substring(1)
                    ) {
                      active = true;
                    }
                    return (
                      <li key={`menu-item-${i}`} className="group relative">
                        <Link
                          href={item.path}
                          target={item.type === "EXTERNAL" ? "_blank" : "_self"}
                          className={cn(`text-black`, active && `underline`)}
                        >
                          {item.title}
                        </Link>
                        {item?.items?.length ? (
                          <ul className="absolute z-10 hidden min-w-[160px] bg-white p-4 shadow-lg group-hover:block">
                            {item?.items?.map((e, i) => (
                              <li key={i}>
                                <Link
                                  href={e.path}
                                  target={
                                    item.type === "EXTERNAL"
                                      ? "_blank"
                                      : "_self"
                                  }
                                  className="text-black"
                                >
                                  {e.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })
              }
            </ul>
          </div>

          <button
            ref={accessibilityButtonRef}
            className="group relative rounded-2xl bg-white p-5"
            aria-label={"Accessibility"}
            onClick={(e) => {
              e.stopPropagation(); // Stop propagation
              handleAccessibilityToggle();
            }}
            type="button"
          >
            {"Accessibility"}
            {showAccessibility && (
              <div
                ref={accessibilityMenuRef}
                className={cn(
                  "rounded-4xl hc:bg-black hc:backdrop-blur-0 absolute end-4 top-14 z-10 flex max-w-[23rem] flex-col justify-center gap-8 bg-black/40 p-8 text-white backdrop-blur-lg",
                  dropdownPosition === "bottom"
                    ? "translate-y-[5%] max-sm:bottom-20"
                    : "bottom-[100%] mb-2 -translate-y-[5%]",
                )}
              >
                <AccessibilityMenu
                  isOpen={true}
                  dropdownPosition={dropdownPosition}
                />
              </div>
            )}
          </button>
        </nav>
      </header>
      <div
        className={`${
          isOpen ? "translate-y-0" : "-translate-y-full"
        } fixed start-0 top-0 z-[8] h-dvh w-full bg-gray-300 transition ease-linear`}
      >
        <ul className="flex flex-col space-y-4 px-4 pt-28">
          {
            //@ts-ignore
            !navItems?.error &&
              navItems?.map((item, i) => {
                let active: boolean = false;

                if (item.path == "/" && !activePath[2]) {
                  active = true;
                } else if (
                  item.path !== "/" &&
                  activePath[1] &&
                  activePath[1] == item.path.substring(1)
                ) {
                  active = true;
                }
                return (
                  <li className="group relative" key={i}>
                    <Link
                      href={item.path}
                      target={item.type === "EXTERNAL" ? "_blank" : "_self"}
                      className={cn(`text-black`, active && `underline`)}
                    >
                      {item.title}
                    </Link>
                    {item?.items?.length ? (
                      <ul className="ps-4">
                        {item?.items?.map((e, i) => (
                          <li key={`mobile-menu-item-${i}`}>
                            <Link
                              href={e.path}
                              target={
                                item.type === "EXTERNAL" ? "_blank" : "_self"
                              }
                              className="text-black"
                            >
                              {e.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })
          }
        </ul>
      </div>
    </>
  );
};

export default HeaderContent;
