const getRootDomain = () => {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (!rootDomain) {
        throw new Error("Please add your root domain to your.env file");
    }
    return rootDomain;
}

export { getRootDomain };
