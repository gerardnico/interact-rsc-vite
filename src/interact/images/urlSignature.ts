import {createHmac} from "crypto";

const expiresKey = "expires";
const sigKey = "sig";

/**
 * Signs a URL by appending an HMAC-SHA256 signature and expiry timestamp.
 *
 * @param url      - The base URL to sign (may already contain query params)
 * @param secret   - The secret key used to generate the HMAC
 * @param ttlSecs  - Time-to-live in seconds (default: 3600 = 1 hour)
 * @returns The signed URL with `expires` and `sig` query parameters appended
 *
 * @example
 * const signed = signUrl("https://example.com/file.pdf", "mysecret", 600);
 * // → "https://example.com/file.pdf?expires=1710000600&sig=abc123..."
 */
export function signUrl(url: URL, secret: string, ttlSecs = 3600) {
    const expires = Math.floor(Date.now() / 1000) + ttlSecs;
    const payload = `${url}|${expires}`;
    const sig = createHmac("sha256", secret).update(payload).digest("hex");


    url.searchParams.set(expiresKey, String(expires));

    url.searchParams.set(sigKey, sig);
}

export type VerificationResultType = { valid: true } | { valid: false; reason: string };

/**
 * Verifies a signed URL.
 *
 * Checks that:
 *  1. Both `expires` and `sig` query params are present
 *  2. The URL has not expired
 *  3. The HMAC signature is valid (timing-safe comparison)
 *
 * @param url - The full signed URL (including `expires` and `sig` params)
 * @param secret    - The same secret key used to sign the URL
 * @returns `{ valid: true }` or `{ valid: false, reason: string }`
 *
 * @example
 * const result = verifyUrl(signedUrl, "mysecret");
 * if (!result.valid) console.error(result.reason);
 */
export function verifyUrlAndDeleteVerificationProperties(
    url: URL,
    secret: string
): VerificationResultType {
    const expires = url.searchParams.get(expiresKey);
    const sig = url.searchParams.get(sigKey);

    if (!expires || !sig) {
        return {valid: false, reason: "Missing expires or sig parameter"};
    }

    const expiresAt = parseInt(expires, 10);
    if (isNaN(expiresAt)) {
        return {valid: false, reason: "Invalid expires parameter"};
    }

    if (Math.floor(Date.now() / 1000) > expiresAt) {
        return {valid: false, reason: "URL has expired"};
    }

    // Reconstruct the original (unsigned) URL to recompute the expected signature
    url.searchParams.delete(expiresKey);
    url.searchParams.delete(sigKey);
    const baseUrl = url.toString();

    const payload = `${baseUrl}|${expires}`;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");

    if (
        sigBuf.length !== expectedBuf.length ||
        !require("crypto").timingSafeEqual(sigBuf, expectedBuf)
    ) {
        return {valid: false, reason: "Invalid signature"};
    }

    return {valid: true};
}

