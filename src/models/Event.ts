import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface IEventAttributes {
    id?: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    organizerDetails: string;
    paidStatus: boolean;
    displayStatus: boolean;
    createdBy: string;
    likesCount?: number;
    dislikesCount?: number;
    eventImages?: string[]; // Add this field to store image IDs
}

interface IEventCreationAttributes extends Optional<IEventAttributes, 'id' | 'likesCount' | 'dislikesCount' | 'eventImages'> {}

export class Event extends Model<IEventAttributes, IEventCreationAttributes> implements IEventAttributes {
    public id!: string;
    public title!: string;
    public description!: string;
    public email!: string;
    public phone!: string;
    public address!: string;
    public city!: string;
    public organizerDetails!: string;
    public paidStatus!: boolean;
    public displayStatus!: boolean;
    public createdBy!: string;
    public likesCount!: number;
    public dislikesCount!: number;
    public eventImages!: string[]; // Add this field to the model

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        Event.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
        Event.hasMany(models.Image, { foreignKey: 'eventId', as: 'images' });
    }
}

export const initEventModel = (sequelize: Sequelize) => {
    Event.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        organizerDetails: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paidStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        displayStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        likesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        dislikesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        eventImages: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Array of image IDs
            defaultValue: [],
        }
    }, {
        sequelize,
        modelName: 'Event',
        timestamps: true,
    });
};
