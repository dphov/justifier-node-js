import * as bcryptjs from 'bcryptjs';
import database from '../db/db';

export default class Auth {
    public static hashPassword(password: string, saltLength: number, callback: (error: Error, hash: string) => void): void {
        bcryptjs.hash(password, saltLength, (error, hash) => {
            callback(error, hash);
        })
    }

    public static compare(password: string, dbHash: string, callback: (error: string | null, match: boolean | null) => void) {
        bcryptjs.compare(password, dbHash, (err: Error, match: boolean ) => {
            if(match) {
                // Passwords match
                callback(null, true);
            } else {
                // Passwords do not match
                callback('Invalid password', null);
            }
        });
    }
}