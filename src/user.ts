import bcrypt from 'bcrypt';

interface IUser {
    name: string,
    email: string,
    password: string
}

interface IAuthData {
    salt: string,
    password: string
}

class UserManager {
    private data: {[key: string]: IAuthData} = {}
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
        this.data[user.email] = {
            salt: salt,
            password: bcrypt.hashSync(user.password, salt)
        }
        return true;
    }
}

export default UserManager;
export { IUser };

// This file ends here.