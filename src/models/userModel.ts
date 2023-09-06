import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { User } from "types/User";

const solveCountSchema = new mongoose.Schema({
    atcoder: { type: Number, default: 0 },
    beecrowd: { type: Number, default: 0 },
    codechef: { type: Number, default: 0 },
    codeforces: { type: Number, default: 0 },
    cses: { type: Number, default: 0 },
    leetcode: { type: Number, default: 0 },
    lightoj: { type: Number, default: 0 },
    spoj: { type: Number, default: 0 },
    timus: { type: Number, default: 0 },
    toph: { type: Number, default: 0 },
    uva: { type: Number, default: 0 },
});

const onlineJudgeHandleSchema = new mongoose.Schema({
    atcoder: { type: String },
    beecrowd: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    cses: { type: String },
    leetcode: { type: String },
    lightoj: { type: String },
    spoj: { type: String },
    timus: { type: String },
    toph: { type: String },
    uva: { type: String },
});

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
        onlineJudgeHandles: {
            types: onlineJudgeHandleSchema,
        },
        solveCount: {
            type: solveCountSchema,
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

export const getUserByUsername = async (username: string) => {
    try {
        const user = await UserModel.findOne({ username });
        // user not found
        if (user === null) return 404;
        return user;
    } catch (error) {
        console.log(error);
        return 500;
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
