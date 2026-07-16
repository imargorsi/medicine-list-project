function mongodbUri(): string {
    const value = process.env.MONGODB_URI;
    if (!value) {
        throw new Error("Missing required environment variable: MONGODB_URI");
    }
    return value;
}

export const env = {
    mongodbUri,
};
