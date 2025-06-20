import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, fullName } = await req.json();

    // Validate input
    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: "Email and fullName are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Dynamically import Firebase Admin to avoid build-time initialization
    const { default: getFirebaseAdmin } = await import("@/lib/firebaseAdmin");
    const admin = getFirebaseAdmin();

    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Firebase service unavailable" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const link = await admin.auth().generateEmailVerificationLink(email, {
      url: "https://todoriko.xyz/email-handler/send-verification",
      handleCodeInApp: true,
    });
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    // Validate email configuration
    if (!process.env.BREVO_USER || !process.env.BREVO_PASS) {
      throw new Error("Email configuration is missing");
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your email</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

            body {
              font-family: 'Montserrat', sans-serif;
              background-color: #f9f8f6;
              margin: 0;
              padding: 40px 20px;
            }

            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 16px;
              padding: 32px;
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
              text-align: center;
            }

            .logo {
              width: 80px;
              margin-bottom: 20px;
            }

            h1 {
              color: #f67011;
              font-size: 24px;
              margin-bottom: 16px;
            }

            p {
              color: #333333;
              font-size: 15px;
              line-height: 1.6;
              margin: 0 0 16px;
            }

            .button {
              display: inline-block;
              margin-top: 24px;
              padding: 12px 24px;
              background-color: #f67011;
              color: #ffffff;
              text-decoration: none;
              font-weight: 600;
              border-radius: 8px;
              transition: background-color 0.3s ease;
            }

            .button:hover {
              background-color: #e6651a;
            }

            .footer {
              font-size: 12px;
              color: #999;
              margin-top: 32px;
            }

            @media (max-width: 480px) {
              .container {
                padding: 24px 16px;
              }

              h1 {
                font-size: 20px;
              }

              .button {
                width: 100%;
                box-sizing: border-box;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img
              src="https://pouch.jumpshare.com/preview/6_AIqzAPfr2S3rdY-ZZD1UbjMWhy99VkX8BH6qRCMqOD1wFFBW9vQFKfTLVyHAopNV-M7wgdENOw-TN1leaHw0uwrS6OPM1xMM8Rv9xAuEU"
              alt="Todoriko Logo"
              class="logo"
            />
            <h1>Email Verification</h1>
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Thank you for signing up at <strong>Todoriko</strong>.</p>
            <p>Click the button below to verify your email address and get started!</p>
            <a href="${link}" class="button">Verify Email</a>
            <p class="footer">If you didn’t request this email, you can ignore it.</p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Todoriko Team" <noreply@todoriko.xyz>',
      to: email,
      subject: "Welcome to Todoriko – Please verify your email",
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Email send failed:", err);

    // Provide more specific error messages for common issues
    let errorMessage = err.message;
    if (err.message.includes("Firebase")) {
      errorMessage =
        "Firebase configuration error. Check your environment variables.";
    } else if (err.message.includes("SMTP") || err.message.includes("Email")) {
      errorMessage =
        "Email service configuration error. Check your email credentials.";
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
