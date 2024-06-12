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
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const user_1 = __importDefault(require("./user"));
const company_1 = __importDefault(require("./company"));
class UserCompany extends sequelize_1.Model {
    static getUserRoleInCompany(companyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCompanyAssociation = yield this.findOne({ where: { userId, companyId } });
            if (!userCompanyAssociation) {
                return false;
            }
            return userCompanyAssociation.role;
        });
    }
}
UserCompany.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_1.default,
            key: 'id',
        },
        allowNull: false,
    },
    companyId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: company_1.default,
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
exports.default = UserCompany;
