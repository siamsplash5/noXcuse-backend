export type SolveCount = {
    atcoder?: number;
    beecrowd?: number;
    codechef?: number; 
    codeforces?: number; 
    cses?: number; 
    leetcode?: number;
    lightoj?: number; 
    spoj?: number; 
    timus?: number; 
    toph?: number; 
    uva?: number 
};

export type User = {
    username: string;
    email: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    institution?: string;
    bio?: string;
    solveCount?: SolveCount;
};
