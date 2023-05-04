import { ReplyKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export interface IButton {
  text: string;
}

export interface IKeyboard {
  layout: IButton[][];
  isResize?: boolean;
  isPersistent?: boolean;
}

export class Keyboard implements IKeyboard {
  public layout: IButton[][];
  public isResize?: boolean;
  public isPersistent?: boolean;
  
  constructor(keyboard: IKeyboard) {
    this.layout = keyboard.layout;
    this.isResize = keyboard.isResize;
    this.isPersistent = keyboard.isPersistent;
  }

  get replyMarkup(): ReplyKeyboardMarkup {
    return {
      keyboard: this.layout,
      resize_keyboard: this.isResize,
      is_persistent: this.isPersistent
    };
  }
}