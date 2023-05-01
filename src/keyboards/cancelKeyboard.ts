import { Keyboard } from "../models/keyboard";

export const CANCEL_CHOICE = "⏪ Cancel";

export const cancelKeyboard = new Keyboard({
  layout: [[{ text: CANCEL_CHOICE }]],
  isPersistent: true,
  isResize: true
});