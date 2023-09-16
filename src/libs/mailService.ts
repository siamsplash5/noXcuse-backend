import nodemailer from "nodemailer";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    },
});

export const sendRegistrationVerifyMail = async (
    otp: string,
    username: string,
    email: string
): Promise<void> => {
    try {
        const emailFormat: string = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to noXcuse</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: url('background-image.jpg') no-repeat center center;
            background-size: cover;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #ff6600;
        }

        p {
            margin: 1em 0;
            line-height: 1.5;
        }

        .code {
            font-size: 1.5em;
            font-weight: bold;
            color: #ff6600;
        }

        .signature {
            margin-top: 20px;
            border-top: 2px solid #ff6600;
            padding-top: 10px;
            font-style: italic;
            color: #ff6600;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Welcome to noXcuse!</h1>
        <p>Hello, ${username}.</p>
        <p>Your email was provided for signup on <strong>noXcuse - A problem-solve count tracking system for
                competitive programmers</strong>. To confirm your registration, enter
            the following code on the verification page:</p>
        <p><strong>OTP: <span class="code">${otp}</span></strong></p>
        <p>This code is valid for 1 hour.</p>
        <p>Thank you for choosing noXcuse. If it was not you, just ignore this email.</p>
        <p class="signature">With best regards,<br><strong>noXcuse Team</strong></p>
    </div>
</body>

</html>
`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "noXcuse - Email Verification",
            html: emailFormat,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error("Sending Mail failed - sendRegistrationVerifyMail");
    }
};

export const passwordRecoveryMail = async (
    otp: string,
    username: string,
    email: string
): Promise<void> => {
    try {
        const emailFormat: string = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to noXcuse!</title>
          </head>
          <body>
            <p>Hello, ${username}.</p>
            <p>You have requested to change your password. Enter the OTP to proceed with the password recovery process.</p>
            <p><b>OTP:  ${otp}</b> <br><br> This code is only valid for 1 hour. </p>
            <p>After that, you will be able to reset your password.</p>
            <p>If it was not you, just ignore this letter.</p>
            <p>With best regards,<br><b>noXcuse Team.</b></p>
          </body>
        </html>`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "noXcuse - Password Recovery Request",
            html: emailFormat,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Sending Mail failed - passwordRecoverEmail");
    }
};
