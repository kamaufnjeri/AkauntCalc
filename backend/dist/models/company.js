"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = __importDefault(require("../config/database.config"));
const sequelize_1 = require("sequelize");
class Company extends sequelize_1.Model {
}
Company.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
    },
    alias: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt', // Define the name of the updatedAt field
});
exports.default = Company;
