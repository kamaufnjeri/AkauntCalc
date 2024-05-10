"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../index"));
class Base extends sequelize_1.Model {
}
Base.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
    },
}, {
    sequelize: index_1.default,
    modelName: 'Base',
    timestamps: true, // Enable timestamps
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});
exports.default = Base;
