"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CompanyControllers_1 = __importDefault(require("../controllers/CompanyControllers"));
const router = express_1.default.Router();
const controller = new CompanyControllers_1.default();
router.post('/', controller.createCompany);
router.put('/:id', controller.updateCompany);
router.get('/:id', controller.getCompany);
router.post('/:id/invitation', controller.sentInvitation);
router.post('/invitation/:token', controller.acceptInvitation);
router.delete('/:id', controller.deleteCompany);
exports.default = router;
