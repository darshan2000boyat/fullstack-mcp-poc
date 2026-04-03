import { useCallback, useEffect, useState } from "react";

export function useDisclosure(
  initialState = false,
  callbacks?: { onOpen?: () => void; onClose?: () => void },
) {
  const { onOpen, onClose } = callbacks || {};
  const [opened, setOpened] = useState(initialState);

  useEffect(() => {
    setOpened(initialState);
  }, [initialState]);

  const open = useCallback(() => {
    setOpened((isOpened) => {
      if (!isOpened) {
        onOpen?.();
        return true;
      }
      return isOpened;
    });
  }, [onOpen]);

  const close = useCallback(() => {
    setOpened((isOpened) => {
      if (isOpened) {
        onClose?.();
        return false;
      }
      return isOpened;
    });
  }, [onClose]);

  const toggle = useCallback(() => {
    opened ? close() : open();
  }, [close, open, opened]);

  const set = useCallback(
    (value: boolean) => {
      setOpened(value);
      if (value) onOpen?.();
      else onClose?.();
    },
    [onClose, onOpen],
  );

  return [opened, { open, close, toggle, set }] as const;
}
