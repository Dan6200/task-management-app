import { atom } from "jotai";

export const isSmallScreenAtom = atom(window.innerWidth <= 960);
