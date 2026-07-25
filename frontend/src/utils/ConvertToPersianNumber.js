const ConvertToPersianNumbers = (input) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    if (input === null || input === undefined) return "";
    return input.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
}

export default ConvertToPersianNumbers;