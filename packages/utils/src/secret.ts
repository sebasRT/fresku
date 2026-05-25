
const getSecret = () => {
    const secret = process.env.FRESKU_SECRET
    if (!secret) {
        throw new Error("FRESKU_SECRET environment variable is not set.");
    }
    return secret;
};

export default getSecret;