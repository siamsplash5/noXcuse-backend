import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { UserDB, User } from "types/User";

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

export const UserModel = mongoose.model("User", UserSchema);

export const createNewUser = async (user: User) => {
    try {
        await UserModel.create(user);
    } catch (error) {
        console.error(error);
        throw new Error("Error when creating a new User");
    }
};

export const getUserByUsername = async (
    username: string
): Promise<UserDB | null> => {
    try {
        const user: UserDB = await UserModel.findOne({ username });
        return user;
    } catch (error) {
        console.error(error);
        throw new Error("Error while fetching user by username");
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await UserModel.findById({ _id: id });
        // user not found
        if (user === null) return 404;
        return user;
    } catch (error) {
        console.log(error);
        return 500;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        // user not found
        if (user === null) return 404;
        return user;
    } catch (error) {
        console.log(error);
        return 500;
    }
};

export const updateUser = async (username: string, updatedInfo: unknown) => {
    try {
        const filter = { username };
        const update = updatedInfo;
        const updatedUserData = await UserModel.findOneAndUpdate(
            filter,
            update,
            { new: true }
        );
        // user not found
        if (updatedUserData === null) return 404;
        // user has found, return the updated document
        return updatedUserData;
    } catch (error) {
        console.log(error);
        return 500;
    }
};

export const deleteUser = async (username: string) => {
    try {
        const deletedUserData = await UserModel.findOneAndDelete({ username });
        // user not found
        if (deletedUserData === null) return 404;
        // user found and deleted, return the data of deleted document
        return deletedUserData;
    } catch (error) {
        console.log(error);
        return 500;
    }
};
