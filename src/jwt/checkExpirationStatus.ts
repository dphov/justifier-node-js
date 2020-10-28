import { Session, ExpirationStatus } from "../common/types";

export function checkExpirationStatus(token: Session): ExpirationStatus {
    const now = Date.now();

    if (token.expires > now) return "active";
    
    // Find the timestamp fo the end of the token's grace period
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const threeHoursAfterExpiration = token.expires + threeHoursInMs;

    if (threeHoursAfterExpiration > now) return "grace";

    return "expired";
}