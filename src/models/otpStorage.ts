import mongoose from "mongoose";
import { OtpObjectType } from "../types/OtpObjectType";

// Define the schema for the blacklisted JWT document
const otpStorageSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true,
            trim: true,
        },
        expiresAt: {
            type: Date,
            default: Date.now() + 3600000,
            index: { expires: "1h" },
        },

        username: {
            type: String,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9._-]+$/, "is invalid"],
            index: true,
        },
        email: {
            type: String,
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const OtpStorageModel = mongoose.model("OtpStorage", otpStorageSchema);

export const storeNewOtp = async (
    otpObject: OtpObjectType
): Promise<OtpObjectType> => {
    try {
        const newOtpObject = await OtpStorageModel.create(otpObject);
        return newOtpObject as unknown as OtpObjectType;
    } catch (error) {
        throw new Error("Query failed - storeNewOtp");
    }
};

export const getOtpByUsername = async (
    username: string
): Promise<OtpObjectType> => {
    try {
        const otpObject = await OtpStorageModel.findOne({ username });
        return otpObject as unknown as OtpObjectType;
    } catch (error) {
        throw new Error("Query failed - getOtpByUsername");
    }
};
