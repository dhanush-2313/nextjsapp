import nodemailer from "nodemailer";
import client from "@/db";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await client.user.update({
        where: { id: userId },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    } else if (emailType === "RESET") {
      await client.user.update({
        where: { id: userId },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.nodemaileruser,
        pass: process.env.nodemailerpass,
      },
    });

    const link =
      emailType === "VERIFY"
        ? `${process.env.domain}/verifyemail?token=${hashedToken}`
        : `http://localhost:3000/forgotpassword`;

    const mailOptions = {
      from: "esp95935@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
            or copy and paste the link below in your browser. <br> ${link}
            </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
