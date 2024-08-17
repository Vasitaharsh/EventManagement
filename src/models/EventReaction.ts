import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the ReactionType enum within the model file
export enum ReactionType {
  Like = 'like',
  Dislike = 'dislike',
}

interface IEventReactionAttributes {
  id?: string;
  userId: string;
  eventId: string;
  reaction: ReactionType;
}

interface IEventReactionCreationAttributes extends IEventReactionAttributes {}

export class EventReaction extends Model<IEventReactionAttributes, IEventReactionCreationAttributes> implements IEventReactionAttributes {
  public id!: string;
  public userId!: string;
  public eventId!: string;
  public reaction!: ReactionType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initEventReactionModel = (sequelize: Sequelize) => {
  EventReaction.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Name of the User table
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Events', // Name of the Event table
        key: 'id',
      },
    },
    reaction: {
      type: DataTypes.ENUM(...Object.values(ReactionType)),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'EventReaction',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'eventId'], // Ensuring uniqueness of userId and eventId combination
      },
    ],
  });
};
