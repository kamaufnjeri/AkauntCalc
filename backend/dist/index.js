"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./models/user"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || ''; // Providing default empty string
const DB_USER = process.env.DB_USER || ''; // Providing default empty string
const DB_PWD = process.env.DB_PWD || ''; // Providing default empty string
const app = (0, express_1.default)();
// Check if environment variables are defined
if (!DB_NAME || !DB_USER || !DB_PWD) {
    console.error("Database configuration is incomplete. Please check your environment variables.");
    process.exit(1); // Exit the application
}
const sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: 'localhost',
    dialect: 'mysql'
});
// Sync models with database
sequelize.sync({ alter: true })
    .then(() => {
    console.log('Database synchronized successfully.');
})
    .catch(err => {
    console.error('Error synchronizing database:', err);
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Welcome to AkauntCalc!');
    const newUser = yield user_1.default.create({
        email: 'kamau',
        password: 'ddd'
    });
}));
app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});
exports.default = sequelize;
