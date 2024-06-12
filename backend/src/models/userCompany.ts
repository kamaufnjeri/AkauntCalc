import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.config";
import User from "./user";
import Company from "./company";

interface UserCompanyAttributes {
    id?: string,
    userId: string,
    companyId: string,
    role: "isAdmin" | "isMember",
}

class UserCompany extends Model<UserCompanyAttributes> {
    public role!: "isAdmin" | "isMember";

    public static async getUserRoleInCompany(companyId: string, userId: string): Promise<"isAdmin" | "isMember" | false> {
        const userCompanyAssociation = await this.findOne({ where: { userId, companyId }});

        if (!userCompanyAssociation) {
            return false;
        }
        return userCompanyAssociation.role;
    }
}

UserCompany.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userId: {  // Ensure lowercase 'userID' here
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
        },
        allowNull: false,
      },
      companyId: {
        type: DataTypes.UUID,
        references: {
          model: Company,
          key: 'id',
        },
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'UserCompany',
      tableName: 'user_company',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  
export default UserCompany;
