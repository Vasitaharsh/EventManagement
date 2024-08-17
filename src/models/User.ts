import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface IUserAttributes {
    id?: string;
    email: string;
    password: string;
    otp?: string;
    otpExpires?: Date;
    role: 'user' | 'admin';
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id' | 'otp' | 'otpExpires' | 'resetPasswordToken' | 'resetPasswordExpires'> {}

export class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    public id!: string;
    public email!: string;
    public password!: string;
    public otp?: string;
    public otpExpires?: Date;
    public role!: 'user' | 'admin';
    public resetPasswordToken?: string;
    public resetPasswordExpires?: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static associate(models: any) {
        User.hasMany(models.Event, { foreignKey: 'createdBy', as: 'events' });
    }
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
        hooks: {
            beforeSave: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });
};
