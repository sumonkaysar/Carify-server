import path from "path";
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";
import httpStatus from "./httpStatus";

interface IInvoiceData {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carTitle: string;
  orderDate: Date;
  transactionId: string;
  totalAmount: number;
}

export const generateInvoice = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const banglaFontPath = path.join(
        __dirname,
        "../fonts/NotoSansBengali-Regular.ttf"
      );
      const margin = 50;
      const doc = new PDFDocument({ size: "A4", margin });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // Title
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Tour Booking Invoice", margin, doc.y, { align: "center" })
        .moveDown(2);

      // Company Details
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Company: ", { continued: true })
        .font("Helvetica")
        .text(invoiceData.companyName, { continued: true });
      // .moveDown(0.3);
      doc
        .text(`Date: ${invoiceData.orderDate.toLocaleDateString()}`, {
          align: "right",
        })
        .moveDown(0.3);

      doc
        .font("Helvetica-Bold")
        .text("Email: ", margin, doc.y, { continued: true })
        .font("Helvetica")
        .text(invoiceData.companyEmail, { continued: true });

      doc
        .font("Helvetica")
        .text(`Transaction ID: ${invoiceData.transactionId}`, {
          align: "right",
        })
        .moveDown(0.3);

      doc
        .font("Helvetica-Bold")
        .text("Phone: ", margin, doc.y, { continued: true })
        .font("Helvetica")
        .text(invoiceData.companyPhone, { continued: true });

      doc
        .font("Helvetica")
        .text(`Payment Method: SSLCommerz`, { align: "right" });

      doc.moveDown(2);

      // Customer Details
      doc
        .fontSize(12)
        .rect(margin, doc.y, 500, 26)
        .fill("#f1f1f1")
        .fillColor("black")
        .font("Helvetica-Bold")
        .text("Customer Details", 55, doc.y + 8)
        .moveTo(margin, doc.y + 4)
        .lineTo(550, doc.y + 4)
        .lineWidth(0.1)
        .strokeColor("#999")
        .stroke()
        .moveDown(1);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Name: ", { continued: true })
        .font("Helvetica")
        .text(invoiceData.customerName)
        .moveDown(0.3);

      doc
        .font("Helvetica-Bold")
        .text("Email: ", { continued: true })
        .font("Helvetica")
        .text(invoiceData.customerEmail)
        .moveDown(0.3);

      doc
        .font("Helvetica-Bold")
        .text("Phone: ", { continued: true })
        .font("Helvetica")
        .text(invoiceData.customerPhone)
        .moveDown(2);

      // Tour Package
      doc.fontSize(12).rect(margin, doc.y, 500, 26).fill("#f1f1f1");
      doc
        .font("Helvetica-Bold")
        .fillColor("black")
        .text("Tour Package", 55, doc.y + 8)
        .text("Price", 400, doc.y - 14, { align: "right" })
        .moveTo(margin, doc.y + 4)
        .lineTo(550, doc.y + 4)
        .lineWidth(0.1)
        .stroke();

      doc.moveDown(1).fontSize(10);
      doc.font("Helvetica").text(`${invoiceData.carTitle}`, 60, doc.y, {
        continued: true,
      });

      doc.registerFont("BanglaFont", banglaFontPath);
      doc
        .font("BanglaFont")
        .text(`৳ ${invoiceData.totalAmount.toFixed(2)}`, { align: "right" })
        .moveDown(1);

      // Total
      doc
        .moveTo(margin, doc.y)
        .lineTo(550, doc.y)
        .strokeColor("black")
        .stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Total", 60, doc.y + 5, { continued: true });
      doc
        .font("BanglaFont")
        .text(`৳ ${invoiceData.totalAmount.toFixed(2)}`, { align: "right" })
        .moveDown(2);

      // Footer note
      doc
        .fontSize(9)
        .fillColor("black")
        .text(
          "Note: This is a system-generated invoice for your tour booking confirmation. Thank you for choosing TWS Travels!",
          margin,
          doc.y
        );

      doc.end();
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Invoice PDF creation error"
    );
  }
};
