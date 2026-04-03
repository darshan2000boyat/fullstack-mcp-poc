"use client";
import { Label } from "@/components/elements/form-fields/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useIsClient } from "@/hooks/useIsClient";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useScrollLock } from "@/hooks/useScrollLock";
import { InfoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

const ExampleComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  const { isLocked, lock, unlock } = useScrollLock({
    autoLock: false,
  });

  const isClient = useIsClient();

  const [mouse, trackingRef] = useMousePosition<HTMLDivElement>();

  const isInside = mouse.elementX !== undefined && mouse.elementY !== undefined;

  const handleLock = () => {
    lock();

    toast({
      title: "Page scrolling is now disabled",
    });
  };
  const handleUnlock = () => {
    unlock();

    toast({
      title: "Page scrolling is now enabled",
    });
  };

  const handleShowModal = () => {
    setShowModal(true);

    toast({
      title:
        "Modal opened with auto-lock. Background scroll is automatically locked",
    });
  };

  useEffect(() => {
    if (isClient) {
      toast({
        title: "Client-side detected!, Browser APIs are now available",
      });
    }
  }, [isClient]);

  //Click outside hook
  const handleClickOutside = () => {
    setIsOpen(false);

    toast({
      title: "Element closed automatically",
    });
  };
  const handleClickInside = () => {
    setIsOpen(true);

    toast({
      title: "Click outside to close",
    });
  };
  useOnClickOutside(
    targetRef as React.RefObject<HTMLElement>,
    handleClickOutside,
  );

  return (
    <div className="space-y-12">
      {/* scroll lock demo */}
      <div className="mx-auto max-w-5xl space-y-4 rounded-3xl bg-lime-100 p-12">
        {/* Header */}
        <div className="space-y-1 text-center">
          <h3 className="font-semibold">Scroll Lock Demo</h3>
          <p className="text-muted-foreground">
            Prevent page scrolling control
          </p>
        </div>

        {/* Status Display */}
        <div className="space-y-2">
          <Label className="font-medium">Current Status</Label>
          <div className="bg-muted flex min-h-[40px] items-center justify-center rounded p-2">
            <div className="px-3 py-1">
              {isLocked ? "🔒 Page Locked" : "🔓 Page Unlocked"}
            </div>
          </div>
        </div>
        {/* Manual Controls */}
        <div className="space-y-2">
          <Label className="font-medium">Manual Control</Label>
          <div className="grid h-10 grid-cols-2 gap-2">
            <Button
              onClick={handleLock}
              disabled={isLocked}
              size="sm"
              className="h-10"
            >
              Lock Scroll
            </Button>
            <Button
              onClick={handleUnlock}
              disabled={!isLocked}
              variant="default"
              size="sm"
              className="h-10"
            >
              Unlock Scroll
            </Button>
          </div>
        </div>
        {/* Modal Demo */}
        <div className="space-y-2">
          <Label className="font-medium">Auto-Lock Demo</Label>
          <div className="flex min-h-[40px] items-center">
            <Button
              onClick={handleShowModal}
              variant="outline"
              className="h-10 w-full [&:not(:hover)]:text-black"
            >
              Open Modal (Auto-Lock)
            </Button>
          </div>
        </div>

        {showModal && <Modal onClose={() => setShowModal(false)} />}

        <div className="space-y-1 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> Use Case
          </h4>
          <p className="text-base">
            This can be used to stop scrolling via script when the popup is open
            without having to hide the scrollbar using CSS. This will prevent
            the layout shift and page jumps.
          </p>
        </div>
      </div>

      {/* Position Display */}
      <div className="mx-auto max-w-5xl space-y-6 rounded-3xl bg-lime-100 p-12">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h3 className="font-semibold">Mouse Position Demo</h3>
          <p className="text-muted-foreground">Real-time cursor tracking</p>
        </div>

        {/* Tracking Area */}
        <div className="space-y-2">
          <Label className="font-medium">Tracking Area</Label>
          <div
            ref={trackingRef}
            className="bg-muted relative flex h-20 cursor-crosshair items-center justify-center rounded-lg"
          >
            <span className="text-muted-foreground">Move mouse here</span>

            {/* Position indicator dot */}
            {isInside && (
              <div
                className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                style={{
                  left: `${mouse.elementX}px`,
                  top: `${mouse.elementY}px`,
                }}
              />
            )}
          </div>
        </div>
        {/* Mouse coordinates */}
        <div className="space-y-2">
          <Label className="font-medium">Coordinates</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted flex min-h-[40px] items-center justify-center rounded p-2">
              <div className="text-center">
                <div className="text-muted-foreground">Global</div>
                <div className="font-mono">
                  {mouse.x}, {mouse.y}
                </div>
              </div>
            </div>
            <div className="bg-muted flex min-h-[40px] items-center justify-center rounded p-2">
              <div className="text-center">
                <div className="text-muted-foreground">Relative</div>
                <div className="font-mono">
                  {isInside
                    ? `${Math.round(mouse.elementX!)}, ${Math.round(mouse.elementY!)}`
                    : "-, -"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Status */}
        <div className="space-y-2">
          <Label className="font-medium">Status</Label>
          <div className="bg-muted flex min-h-[40px] items-center justify-center rounded p-2">
            <div className="px-3 py-1">
              {isInside ? "🎯 Tracking" : "📍 Waiting"}
            </div>
          </div>
        </div>
        {/* Instructions */}
        <div className="flex min-h-[20px] items-center justify-center text-center">
          <div className="text-muted-foreground">
            Hover over tracking area to see coordinates
          </div>
        </div>

        <div className="space-y-1 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> Use Case
          </h4>
          <p className="text-base">
            This can be used for accurately moving the custom cursor.
          </p>
        </div>
      </div>

      {/* Click outside hook demo */}
      <div className="mx-auto max-w-5xl space-y-6 rounded-3xl bg-lime-100 p-12">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h3 className="font-semibold">Click Outside Demo</h3>
          <p className="text-muted-foreground">Outside click detection</p>
        </div>

        {/* Element Status */}
        <div className="space-y-2">
          <Label className="font-medium">Element State</Label>
          <div className="bg-muted flex min-h-[48px] items-center justify-center rounded p-3">
            <div className="px-4 py-2">{isOpen ? "🟢 Open" : "🔴 Closed"}</div>
          </div>
        </div>
        {/* Interactive Target */}
        <div className="space-y-2">
          <Label className="font-medium">Target Element</Label>
          <div
            ref={targetRef}
            onClick={handleClickInside}
            className={`flex min-h-[80px] cursor-pointer items-center justify-center rounded-lg p-4 transition-colors ${
              isOpen
                ? "border-2 border-primary bg-primary/20"
                : "bg-muted border-muted hover:bg-muted/80 border-2"
            }`}
          >
            <p className="text-center font-medium">
              {isOpen ? "Click outside to close" : "Click to open"}
            </p>
          </div>
        </div>
        {/* Instructions */}
        <div className="flex min-h-[20px] items-center justify-center text-center">
          <div className="text-muted-foreground">
            {isOpen
              ? "Now click anywhere outside the target"
              : "Click the target to activate outside detection"}
          </div>
        </div>

        <div className="space-y-1 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> Use Case
          </h4>
          <p className="text-base">
            This can be used to close popups by clicking outside the element.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 rounded-3xl bg-lime-100 p-12">
        <div className="space-y-1 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> More hooks
          </h4>
          <p className="text-base">
            For more useful hooks refer here:{" "}
            <a
              href="https://www.shadcn.io/hooks"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.shadcn.io/hooks
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto min-h-80 w-screen space-y-6 bg-lime-100 p-12">
        <div className="space-y-6 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> {`"w-screen" block`}
          </h4>
          <p className="text-xl">
            Using <strong>w-screen</strong> for full screen blocks helps to
            avoid layout shifts when the scrollbar is hidden. <br />
            This issue mostly occurs on windows. <strong>100vw</strong> screen
            extends beyound the scrollbar which is unaffected by the scrollbar
            toggle. <br /> Use <strong>w-screen</strong> even for fixed
            elements.
          </p>
          <p className="text-xl">
            Also, in this base template I have added dynamic scrollbar that
            appears only if you hover on the right side of the screen. <br />
            This is only for windows as macOS has overlay scrollbar by default.
          </p>
          <p className="text-xl">
            Hooks used here are as follows:
            <ul className="">
              <li>
                1. <strong>usePlatformDetection</strong> - to detect if device
                is windows or mac
              </li>
              <li>
                2. <strong>useEdgeScrollbar</strong> - to detect edge of
                scrollbar to hide/show scrollbar
              </li>
            </ul>
          </p>
        </div>
      </div>

      <div className="mx-auto min-h-80 w-screen space-y-6 bg-lime-100 p-12">
        <div className="space-y-6 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> {`"static vh" block`}
          </h4>
          <p className="text-xl">
            While using <strong>h-screen</strong> we get vertical layout shift
            issues on IOS mobile devices. While using <strong>h-dvh</strong>{" "}
            rectifies this issue, on some devices this issue still persists.{" "}
            <br />
            {`Hence, to keep this consistent we can use a static height. This
            value is set on page load and doesn't change when vertical height
            changes. Use this only for mobile devices.`}
          </p>
          <p className="text-xl">
            For full height use <strong>h-screen-static</strong>. For custom
            height for example <strong>70vh</strong> use{" "}
            <strong>h-[calc(var(--static-vh,1vh)*70)]</strong>
          </p>
          <p className="text-xl">
            Hooks used here are as follows:
            <ul className="">
              <li>
                1. <strong>useStaticVh</strong>
              </li>
            </ul>
          </p>
        </div>
      </div>

      <div className="mx-auto min-h-80 w-screen space-y-6 bg-lime-100 p-12">
        <div className="space-y-6 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> {`"Platform detection" hook`}
          </h4>
          <p className="text-xl">
            {`There's`} support added for platform detection i.e windows or IOS.{" "}
            <br />
            Sometimes some CSS works differently on IOS and windows for example
            fonts, lineheights etc. This creates inconsistency in UI. <br />
            Hence, to resolve this windows and mac tailwind varients are added
            in this template.
          </p>
          <p className="text-xl">
            For windows specific CSS use <strong>windows:you-css</strong>. For
            mac use <strong>mac:you-css</strong>
          </p>
          <p className="text-xl">
            Hooks used here are as follows:
            <ul className="">
              <li>
                1. <strong>usePlatformDetection</strong>
              </li>
            </ul>
          </p>
        </div>
      </div>

      <div className="mx-auto min-h-80 w-screen space-y-6 bg-lime-100 p-12">
        <div className="space-y-6 text-center">
          <h4 className="flex items-center justify-center gap-2 font-semibold">
            <InfoIcon size={20} /> {`"Accessibility" widget`}
          </h4>
          <p className="text-xl">
            {`There's a standard accessibility widget added to the template.
            You can try this by clicking on the "Accessibility" button in the
            Header navigation.`}{" "}
            <br /> This widget has font size{" "}
            <strong>Increase, Decrease and High Contrast</strong> options.
          </p>
          <p className="text-xl">
            Font size options are calculated using root font size. To apply
            Hight Contrast CSS for you elements use the <strong>hc</strong>{" "}
            varient for example <strong>hc:bg-black</strong>
          </p>
          <p className="text-xl">
            Hooks used here are as follows:
            <ul className="">
              <li>
                1. <strong>useAccessibility</strong>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

function Modal({ onClose }: { onClose: () => void }) {
  // Auto-lock scroll when modal is mounted
  useScrollLock();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg">
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h4 className="font-semibold">Modal with Auto-Lock</h4>
            <div className="px-3 py-1">🔒 Scroll Locked</div>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Background scrolling is automatically disabled while this modal is
            open. Try scrolling behind this dialog.
          </p>

          <Button onClick={onClose} className="h-10 w-full">
            Close Modal
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExampleComponent;
