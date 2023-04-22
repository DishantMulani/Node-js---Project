import mongoose from "mongoose";
mongoose.set('strictQuery', true);

export class DBUtil {
    public static connectToDb = (dbUrl: string, dbName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            mongoose.connect(dbUrl, {
                dbName: dbName,
            },
                (err) => {
                    if (err)
                        reject("Mongo Db Connection Failed.....");
                    else
                        resolve("Mongo Db Connection Successfully.....");
                })
        })
    }
}