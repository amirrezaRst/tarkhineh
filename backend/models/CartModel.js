const { required } = require("joi");
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
            quantity: { type: Number, min: 1, default: 1, required: true }
        }
    ],
}, { timestamps: true });


// CartSchema.methods.calculateTotal = async function () {
//     let totalPrice = 0;

//     for (const item of this.items) {
//         const menuItem = await mongoose.model('Menu').findById(item.menuItem);

//         // محاسبه قیمت نهایی بر اساس تعداد
//         const itemPrice = menuItem.price; // فرض شده که منو قیمت ثابت دارد
//         totalPrice += itemPrice * item.quantity;
//     }

//     // اعمال تخفیف به مجموع قیمت
//     if (this.coupon) {
//         const coupon = await mongoose.model('Coupon').findById(this.coupon);
//         if (coupon.discountType === 'percentage') {
//             totalPrice -= (totalPrice * coupon.discountAmount) / 100;
//         } else if (coupon.discountType === 'flat') {
//             totalPrice -= coupon.discountAmount;
//         }
//     }

//     this.finalPrice = totalPrice;
//     await this.save();
// };

module.exports = mongoose.model('Cart', CartSchema);
