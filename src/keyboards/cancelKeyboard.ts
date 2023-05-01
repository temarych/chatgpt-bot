import { Markup } from "telegraf";
import { Keyboard } from "../models/Keyboard";

export const CANCEL_CHOICE = "⏪ Cancel";

export const cancelKeyboard = new Keyboard({
  layout: [[{ text: CANCEL_CHOICE }]],
  isPersistent: true,
  isResize: true
});