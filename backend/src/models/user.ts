import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.config';

interface UserAttributes {
    id?: string,
    firstName?: string,
    lastName?: string,
    email: string,
    phoneNumber?: string,
    password: string,
}


class User extends Model<UserAttributes> {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users', // Assuming the table name is 'users'
        timestamps: true, // Enable automatic timestamp management by Sequelize
        createdAt: 'createdAt', // Define the name of the createdAt field
        updatedAt: 'updatedAt', // Define the name of the updatedAt field
    }
);

export default User;
