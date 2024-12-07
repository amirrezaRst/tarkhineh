const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true }, // آیتم منو که تخفیف دارد
    discountType: { type: String, enum: ['percentage', 'flat'], required: true }, // نوع تخفیف
    discountValue: { type: Number, required: true }, // مقدار تخفیف
    startDate: { type: Date, required: true }, // زمان شروع تخفیف
    endDate: { type: Date, required: true }, // زمان پایان تخفیف
    active: { type: Boolean, default: true } // وضعیت فعال بودن
}); 

module.exports = mongoose.model('MenuDiscount', discountSchema);


// const getMenuWithDiscount = async (menuId) => {
//     const menuItem = await Menu.findById(menuId);
//     const discount = await MenuDiscount.findOne({ 
//         menuItem: menuId, 
//         active: true, 
//         startDate: { $lte: new Date() }, 
//         endDate: { $gte: new Date() } 
//     });

//     if (!discount) {
//         return menuItem; // بدون تخفیف
//     }

//     let discountedPrice;
//     if (discount.discountType === 'percentage') {
//         discountedPrice = menuItem.price - (menuItem.price * (discount.discountValue / 100));
//     } else {
//         discountedPrice = menuItem.price - discount.discountValue;
//     }

//     return {
//         ...menuItem.toObject(),
//         discountedPrice: discountedPrice > 0 ? discountedPrice : 0
//     };
// };
