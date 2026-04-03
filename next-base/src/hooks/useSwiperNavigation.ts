"use client";
import { customAlphabet } from "nanoid";

export const useSwiperNavigation = () => {
  const nanoid = customAlphabet("abcdefghiklmnopqrstuvwxyz", 5);

  const prevId = nanoid();
  const nextId = nanoid();

  const prevEl = `.${prevId}`;
  const nextEl = `.${nextId}`;

  return {
    prevEl: prevEl,
    nextEl: nextEl,
    prevId,
    nextId,
  };
};
