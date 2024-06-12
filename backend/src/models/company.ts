import sequelize from "../config/database.config";
import { DataTypes, Model } from "sequelize";

interface CompanyAtribbutes {
    id?: string,
    name: string,
    phoneNumber?: string,
    email?: string,
    country?: string,
    currency?: string,
    alias?: string,
}

class Company extends Model<CompanyAtribbutes> {
    public id!: string;
    public name!: string;
}

Company.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        currency: {
            type: DataTypes.STRING,
        },
        alias: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Company',
        tableName: 'companies',
        timestamps: true, // Enable automatic timestamp management by Sequelize
        createdAt: 'createdAt', // Define the name of the createdAt field
        updatedAt: 'updatedAt', // Define the name of the updatedAt field
    },
);

export default Company;