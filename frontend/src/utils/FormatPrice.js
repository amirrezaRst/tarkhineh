import ConvertToPersianNumbers from "./ConvertToPersianNumber";

const FormatPrice = (price) => {
    const formattedPrice = (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return ConvertToPersianNumbers(formattedPrice); // تبدیل اعداد به فارسی بعد از فرمت
}

export default FormatPrice;