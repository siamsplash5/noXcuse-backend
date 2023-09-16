import mongoose from "mongoose";

// Define the schema for the blacklisted JWT document
const BLTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: "expiresAt" },
        },
    },
    { timestamps: true }
);

const BLTokenModel = mongoose.model("BlackListedToken", BLTokenSchema);

export const isBlackListed = async (jwtToken: string): Promise<string> => {
    try {
        const user = await BLTokenModel.findOne({ token: jwtToken }).select(
            "token"
        );
        return user as unknown as string;
    } catch (error) {
        throw new Error("Query failed - isBlackListed");
    }
};
