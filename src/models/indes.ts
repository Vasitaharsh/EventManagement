import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';


const basename = path.basename(__filename);
import config from '../config/config';

interface ModelWithAssociations extends ModelStatic<Model> {
  associate?: (db: DB) => void;
}

interface DB {
  [key: string]: ModelWithAssociations | Sequelize | typeof Sequelize;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: DB = {} as DB;
console.log(config);

let sequelize: Sequelize;

sequelize = new Sequelize( config.test.database as string, config.test.username as string, config.test.password as string,  {
  host: config.test.host,
  port : 3308,
  dialect: config.test.dialect,
  dialectOptions: {
    connectionLimit: 10,
  }
});

const modelImportPromises = fs.readdirSync(__dirname)
    .filter((file: string) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
    })
    .map(async (file: string) => {
        const { default: model } = await import(path.join(__dirname, file));
        return model(sequelize, DataTypes);
    });

Promise.all(modelImportPromises)
    .then(models => {
        models.forEach(model => {
            db[model.name] = model;
        });
    })
    .catch(err => console.error('Error loading models:', err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize };
export default db;
