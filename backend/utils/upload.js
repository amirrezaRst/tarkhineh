const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

const uploadImage = (options) => {
    const upload = multer({
        limits: {
            fileSize: options.fileSize || 3000000, // پیش‌فرض 3 مگابایت
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
            }
            cb(undefined, true);
        },
        storage: multer.memoryStorage(),
    });

    // امکان آپلود یک یا چند تصویر
    const imageUpload = upload.array(options.fieldName || 'images', options.maxCount || 10); // حداکثر 10 تصویر

    const imageProcessing = async (req, res, next) => {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        const processedImages = [];
        for (const file of req.files) {
            const filename = `${shortid.generate()}.jpg`;
            const filepath = path.join(__dirname, options.destination || '../public/menu-images/', filename);

            await sharp(file.buffer)
                .resize(options.width || 500, options.height || 500)
                .jpeg({ quality: options.quality || 70 })
                .toFile(filepath);

            processedImages.push(filename);
        }

        // ذخیره نام فایل‌ها در body درخواست
        req.body[options.fieldName || 'images'] = processedImages;

        next();
    };

    return [imageUpload, imageProcessing];
};

module.exports = uploadImage;
