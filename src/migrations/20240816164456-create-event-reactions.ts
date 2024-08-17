import { QueryInterface, DataTypes } from 'sequelize';
import { ReactionType } from '../models/EventReaction'; // Adjust the path to your model

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('EventReactions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id',
        },
      },
      reaction: {
        type: DataTypes.ENUM(...Object.values(ReactionType)),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('EventReactions');
  },
};
