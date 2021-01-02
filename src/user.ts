import bcrypt from 'bcrypt';
import fs from 'fs';

// @typesがないモジュール
const identicon = require('identicon');

interface IUser {
    name: string,
    email: string,
    password: string
}

interface IAuthData {
    salt: string,
    password: string,
    photo: string
}

class UserManager {
    private data: {[key: string]: IAuthData} = {}
    getUser(user: IUser): {displayName: string, photo: string} | undefined {
        if (!this.auth(user)) return undefined;
        return {
            displayName: user.name,
            photo: this.data[user.email].photo
        }
    }
    findUser(user: IUser): boolean {
        if (this.data[user.email]) {
            return true;
        }
        return false;
    }
    auth(user: IUser): boolean {
        if (!this.data[user.email]) {
            return false;
        }
        const password = bcrypt.hashSync(user.password, this.data[user.email].salt);
        return this.data[user.email].password == password;
    }
    registration(user: IUser) {
        if (this.findUser(user)) return false;
        const salt = bcrypt.genSaltSync();
        const photoPath = `public/images/${user.name}.png`;
        const buffer = identicon.generateSync({id: user.email, size: 40});
        fs.writeFileSync(photoPath, buffer);
        this.data[user.email] = {
            salt: salt,
            password: bcrypt.hashSync(user.password, salt),
            photo: `/images/${user.name}.png`
        }
        return true;
    }
}

export default UserManager;
export { IUser };

// This file ends here.