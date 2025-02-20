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
