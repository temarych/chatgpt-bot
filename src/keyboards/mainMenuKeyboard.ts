import { Keyboard } from "../models/keyboard";

export const ASK_CHOICE = "🤖 Ask";
export const HELP_CHOICE = "🛟 Help";

export const mainMenuKeyboard = new Keyboard({
  layout: [[
    { text: ASK_CHOICE },
    { text: HELP_CHOICE }
  ]],
  isPersistent: true,
  isResize: true
});