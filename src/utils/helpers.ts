export function generateRandomId(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [4, 4, 4, 4]; // 4 segments of 4 characters each
  return segments
    .map((segment) => {
      let result = "";
      for (let i = 0; i < segment; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    })
    .join("-");
}

export const formatDateString = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatTimeFromDateString = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFullDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};


export const getRandomColorPair = (): { bgColor: string; textColor: string } =>{

  const randomHex = (): number => Math.floor(Math.random() * 256);


  const rgbToHex = (r: number, g: number, b: number): string =>
    `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;


  const r = randomHex();
  const g = randomHex();
  const b = randomHex();
  const bgColor = rgbToHex(r, g, b);


  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? "#000000" : "#FFFFFF";

  return { bgColor, textColor };
}

