import * as otpGenerator from 'otp-generator';

export function generateOTP(): string {
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  return otp;
}
