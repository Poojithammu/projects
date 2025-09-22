import {sendWhatsappSMS, generateOtp} from './WhatsappSmsUtility.js'

const sendOtpForAuthentication = async (mobile, dialCode = null) => {
  try {
    const otp = generateOtp();
    const message = `Your verification code is: ${otp}`;

    const response = await sendWhatsappSMS({
      mobile,
      message,
      dialCode,
    });

    if (response && response.status === "success") {
      return {
        success: true,
        otp: otp.toString(),
        message: "OTP sent successfully via WhatsApp.",
      };
    } else {
      return {
        success: false,
        otp: null,
        message: response?.message || "Failed to send OTP.",
      };
    }
  } catch (error) {
    return {
      success: false,
      otp: null,
      message: error.message || "Unexpected error occurred while sending OTP.",
    };
  }
};

sendOtpForAuthentication(8179808340, +91)

