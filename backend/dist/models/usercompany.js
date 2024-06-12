"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const user_1 = __importDefault(require("./user"));
const company_1 = require("./company");
class UserCompany extends sequelize_1.Model {
}
UserCompany.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    userID: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_1.default,
            key: 'id',
        },
        allowNull: false,
    },
    companyID: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: company_1.Company,
            key: 'id',
        },
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database_config_1.default,
    modelName: 'UserCompany',
    tableName: 'user_company',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});
user_1.default.belongsToMany(company_1.Company, { through: UserCompany });
company_1.Company.belongsToMany(user_1.default, { through: UserCompany });
