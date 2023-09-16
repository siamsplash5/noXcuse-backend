export default function generateRandom6DigitNumber(): string {
    const min: number = 100000; // Minimum 6-digit number (inclusive)
    const max: number = 999999; // Maximum 6-digit number (inclusive)
    const randomNumber: number =
        Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
}
