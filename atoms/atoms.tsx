import { atom } from "recoil";

export const translateYAtom = atom<number>({
  key: "translateYAtom",
  default: 1000,
});

export const opacityAtom = atom<number>({
  key: "opacityAtom",
  default: 0,
});
