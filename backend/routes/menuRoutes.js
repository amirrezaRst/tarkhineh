const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { createMenuValidation } = require('../validation/menuValidation');


router.route("/")
    .get(getMenuItems)
    .post( createMenuItem);

router.route("/:id")
    .get(getMenuItemById)
    .put(updateMenuItem)
    .delete(deleteMenuItem);

// // ایجاد آیتم جدید در منو
// router.post('/menu', menuController.createMenuItem);

// // دریافت همه آیتم‌های منو
// router.get('/menu', menuController.getMenuItems);

// // دریافت یک آیتم خاص از منو بر اساس ID
// router.get('/menu/:id', menuController.getMenuItemById);

// // ویرایش آیتم منو
// router.put('/menu/:id', menuController.updateMenuItem);

// // حذف آیتم منو
// router.delete('/menu/:id', menuController.deleteMenuItem);

module.exports = router;
