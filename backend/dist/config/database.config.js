"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
const DB_NAME = process.env.DB_NAME || ''; // Providing default empty string
const DB_USER = process.env.DB_USER || ''; // Providing default empty string
const DB_PWD = process.env.DB_PWD || ''; // Providing default empty string
// Check if environment variables are defined
if (!DB_NAME || !DB_USER || !DB_PWD) {
    console.error("Database configuration is incomplete. Please check your environment variables.");
    process.exit(1); // Exit the application
}
exports.sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
exports.default = exports.sequelize;
