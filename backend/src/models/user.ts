import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.config';
import bcrypt from 'bcrypt';
import Company from './company';


interface UserAttributes {
    id?: string,
    firstName?: string,
    lastName?: string,
    email: string,
    phoneNumber?: string,
    password: string,
    isVerified?: boolean,
}


class User extends Model<UserAttributes> {
    public password!: string; // Define the password property
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public phoneNumber!: string;
    public email!: string;
    public isVerified!: boolean;

    public async comparePassword(plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, this.password);
    }

    public static async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ where: { email } })
    }

   
}

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
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        hooks: {
            beforeCreate: async (user: User) => {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(user.password, salt);
                user.password = hashedPassword;
            }
        }
    }
);


export default User;
