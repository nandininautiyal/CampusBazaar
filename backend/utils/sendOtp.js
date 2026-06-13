const { Resend } = require("resend");

const sendOtpEmail = async (toEmail, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "CampusBazaar <onboarding@resend.dev>",
    to: toEmail,
    subject: "Verify your CampusBazaar account",
    html: `<p>Your OTP for CampusBazaar registration is:</p>
           <h2>${otp}</h2>
           <p>This code expires in 10 minutes.</p>`,
  });
};

module.exports = sendOtpEmail;