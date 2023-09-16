import { Document } from "mongoose";

export type User = {
    username: string;
    email: string;
    password: string;
    role?: "admin" | "guest"; // Enum values as string literals
    firstName?: string;
    lastName?: string;
    institution?: string;
    bio?: string;
    atcoderHandle?: string | null; // Handle can be a string or null
    beecrowdHandle?: string | null;
    codechefHandle?: string | null;
    codeforcesHandle?: string | null;
    csesHandle?: string | null;
    leetcodeHandle?: string | null;
    lightojHandle?: string | null;
    spojHandle?: string | null;
    timusHandle?: string | null;
    tophHandle?: string | null;
    uvaHandle?: string | null;
    atcoderSolve?: number;
    beecrowdSolve?: number;
    codechefSolve?: number;
    codeforcesSolve?: number;
    csesSolve?: number;
    leetcodeSolve?: number;
    lightojSolve?: number;
    spojSolve?: number;
    timusSolve?: number;
    tophSolve?: number;
    uvaSolve?: number;
    // createdAt: Date;
    // updatedAt: Date;
};

export type UserDB = User & Document;
