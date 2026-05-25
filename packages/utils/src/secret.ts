
function getSecret() {
    const secret = process.env.FRESKU_SECRET
    if (!secret) {
        throw new Error("FRESKU_SECRET environment variable is not set.");
    }
    return secret;
};

type Algorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "PS256" | "PS384" | "PS512" | "ES256" | "ES384" | "ES512" | "EdDSA";

function getAlgorithm(): Algorithm {
    const alg = process.env.FRESKU_JWT_ALG as Algorithm || 'HS256';
    return alg;
}

export { getAlgorithm, getSecret };

