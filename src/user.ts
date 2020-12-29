import { Sequelize, DataTypes, Model, Op } from 'sequelize';
import bcrypt from 'bcrypt';

interface IUser {
    name: string,
    password: string
}

const dataFile = 'dat/users.sqlite';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dataFile
});

const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING, allowNull: false, unique: true
    },
    password: {
        type: DataTypes.STRING, allowNull: false
    }
});

(async () => {
    await User.sync();
    const user = await User.create({
        name: 'admin',
        password: 'password'
    });

    const users = await User.findAll();
    users.forEach(user => {
        console.log(user);
    });
})();

// This file ends here.