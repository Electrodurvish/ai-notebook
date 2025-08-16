import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`📧 [EMAIL LOG] Would send email to ${to}`);
      console.log(`📧 [EMAIL LOG] Subject: ${subject}`);
      console.log(`📧 [EMAIL LOG] Content: ${text.substring(0, 100)}...`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    
    // Log email details for debugging
    console.log(`📧 [FAILED EMAIL] To: ${to}`);
    console.log(`📧 [FAILED EMAIL] Subject: ${subject}`);
    console.log(`📧 [FAILED EMAIL] Content: ${text.substring(0, 100)}...`);
  }
};
