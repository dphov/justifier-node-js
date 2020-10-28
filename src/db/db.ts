import Nedb from 'nedb';

const database = new Nedb('database.db');
database.loadDatabase();

export default database;