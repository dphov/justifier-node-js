import { encode, TAlgorithm } from "jwt-simple";
import { EncodeResult, PartialSession, Session } from "../common/types";

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = "HS512";
    // Determine when the token should expire
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session: Session = {
        ...partialSession,
        issued: issued,
        expires: expires
    };
    
    return {
        token: encode(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}