import { DataTypes, Model, Sequelize } from 'sequelize';

export interface IScheduledEventAttributes {
  id?: string;
  eventIds: string[]; // Array of UUIDs referencing Events
  scheduledAt: Date;
  createdBy: string; // UUID referencing User
}

interface IScheduledEventCreationAttributes extends IScheduledEventAttributes {}

export class ScheduledEvent extends Model<IScheduledEventAttributes, IScheduledEventCreationAttributes> implements IScheduledEventAttributes {
  public id?: string;
  public eventIds!: string[]; // Make sure to use non-null assertion if always expected
  public scheduledAt!: Date;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initScheduledEventModel = (sequelize: Sequelize) => {
  ScheduledEvent.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventIds: {
      type: DataTypes.ARRAY(DataTypes.UUID), // Ensure your database supports this
      allowNull: false,
      // references: { // This might not be necessary for array fields
      //   model: 'Events', // Name of the Event table
      //   key: 'id',
      // },
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Name of the User table
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'ScheduledEvent',
    timestamps: true,
  });
};
