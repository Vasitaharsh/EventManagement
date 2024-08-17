import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface IImageAttributes {
    id?: string;
    filename: string;
    path: string;
    eventId: string; // Foreign key to Event
}

interface IImageCreationAttributes extends Optional<IImageAttributes, 'id'> {}

export class Image extends Model<IImageAttributes, IImageCreationAttributes> implements IImageAttributes {
    public id!: string;
    public filename!: string;
    public path!: string;
    public eventId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        Image.belongsTo(models.Event, { foreignKey: 'eventId', as: 'event' });
    }
}

export const initImageModel = (sequelize: Sequelize) => {
    Image.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Image',
        timestamps: true,
    });
};
