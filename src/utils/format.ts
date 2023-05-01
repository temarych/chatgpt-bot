export const combineParagraphs = (paragraphs: string[], spacing: number = 0) => paragraphs.join("\n".repeat(spacing + 1));
export const bold = (text: string) => `<b>${text}</b>`;