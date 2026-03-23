"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const roomController_1 = require("../controller/roomController");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.post("/logout", userController_1.logout);
router.post("/rooms", auth_1.auth, roomController_1.createRoom);
router.post("/join-room", auth_1.auth, roomController_1.joinRoom);
exports.default = router;
