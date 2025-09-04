export function generateSixDigitOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
