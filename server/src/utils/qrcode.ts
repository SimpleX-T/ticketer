import QRCode from "qrcode";

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#02191d",
        light: "#ffffff",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const generateTicketQRData = (
  ticketCode: string,
  eventId: string
): string => {
  return JSON.stringify({
    ticketCode,
    eventId,
    timestamp: Date.now(),
  });
};
