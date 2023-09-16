import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { UserDB, User } from "types/User";
import { UserExistResponse } from "types/UserExistResponseType";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9._-]+$/, "is invalid"],
            index: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
            default: "guest",
            enum: ["admin", "guest"],
        },
        firstName: {
            type: String,
            trim: true,
            default: "",
        },
        lastName: {
            type: String,
            trim: true,
            default: "",
        },
        inistitution: {
            type: String,
            trim: true,
            default: "",
        },
        bio: {
            type: String,
            trim: true,
            default: "",
        },
        atcoderHandle: {
            type: String,
            default: null,
        },
        beecrowdHandle: {
            type: String,
            default: null,
        },
        codechefHandle: {
            type: String,
            default: null,
        },
        codeforcesHandle: {
            type: String,
            default: null,
        },
        csesHandle: {
            type: String,
            default: null,
        },
        leetcodeHandle: {
            type: String,
            default: null,
        },
        lightojHandle: {
            type: String,
            default: null,
        },
        spojHandle: {
            type: String,
            default: null,
        },
        timusHandle: {
            type: String,
            default: null,
        },
        tophHandle: {
            type: String,
            default: null,
        },
        uvaHandle: {
            type: String,
            default: null,
        },
        atcoderSolve: {
            type: Number,
            default: 0,
        },
        beecrowdSolve: {
            type: Number,
            default: 0,
        },
        codechefSolve: {
            type: Number,
            default: 0,
        },
        codeforcesSolve: {
            type: Number,
            default: 0,
        },
        csesSolve: {
            type: Number,
            default: 0,
        },
        leetcodeSolve: {
            type: Number,
            default: 0,
        },
        lightojSolve: {
            type: Number,
            default: 0,
        },
        spojSolve: {
            type: Number,
            default: 0,
        },
        timusSolve: {
            type: Number,
            default: 0,
        },
        tophSolve: {
            type: Number,
            default: 0,
        },
        uvaSolve: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

const UserModel = mongoose.model("User", UserSchema);

export const createNewUser = async (user: User): Promise<UserDB> => {
    try {
        const newUser = await UserModel.create(user);
        return newUser as unknown as UserDB;
    } catch (error) {
        throw new Error("Query failed - createNewUser");
    }
};

export const getUserByUsername = async (
    username: string
): Promise<UserDB | null> => {
    try {
        const user: UserDB = await UserModel.findOne({ username });
        return user;
    } catch (error) {
        throw new Error("Query failed - getUserByUsername");
    }
};

export const getUserById = async (id: string): Promise<UserDB | null> => {
    try {
        const user: UserDB = await UserModel.findById({ _id: id });
        return user;
    } catch (error) {
        throw new Error("Query failed - getUserById");
    }
};

export const getUserByEmail = async (email: string): Promise<UserDB | null> => {
    try {
        const user: UserDB = await UserModel.findOne({ email });
        return user;
    } catch (error) {
        throw new Error("Query failed - getUserByEmail");
    }
};

export const isUserExist = async (
    checkingKey: string,
    filterBy: {
        byUsername?: boolean;
        byEmail?: boolean;
        byMongoDBId?: boolean;
    },
    getInfoOf: {
        username?: boolean;
        email?: boolean;
        mongoDBId?: boolean;
        password?: boolean;
    }
): Promise<UserExistResponse> => {
    try {
        const { byUsername, byEmail, byMongoDBId } = filterBy;
        const { username, email, mongoDBId, password } = getInfoOf;
        let filter, field: string = "";

        if (username) {
            field += "username ";
        }
        if (email) {
            field += "email ";
        }
        if (mongoDBId) {
            field += "_id ";
        }
        if (password) {
            field += "password ";
        }

        if (byUsername) {
            filter = { username: checkingKey };
        } else if (byEmail) {
            filter = { email: checkingKey };
        } else if (byMongoDBId) {
            filter = { _id: checkingKey };
        }

        const user = await UserModel.findOne(filter).select(field);

        return user as unknown as UserExistResponse;
    } catch (error) {
        throw new Error("Query failed - isUserExist");
    }
};

// export const updateUser = async (username: string, updatedInfo: unknown) => {
//     try {
//         const filter = { username };
//         const update = updatedInfo;
//         const updatedUserData = await UserModel.findOneAndUpdate(
//             filter,
//             update,
//             { new: true }
//         );
//         // user not found
//         if (updatedUserData === null) return 404;
//         // user has found, return the updated document
//         return updatedUserData;
//     } catch (error) {
//         console.log(error);
//         return 500;
//     }
// };

// export const deleteUser = async (username: string) => {
//     try {
//         const deletedUserData = await UserModel.findOneAndDelete({ username });
//         // user not found
//         if (deletedUserData === null) return 404;
//         // user found and deleted, return the data of deleted document
//         return deletedUserData;
//     } catch (error) {
//         console.log(error);
//         return 500;
//     }
// };
