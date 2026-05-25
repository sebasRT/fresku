const getRootDomain = () => {
    const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (!baseUrl) {
        throw new Error("Please add your base URL to your.env file");
    }
    return baseUrl;
};

export { getRootDomain };

