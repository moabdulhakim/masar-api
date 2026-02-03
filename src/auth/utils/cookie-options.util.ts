import { CookieOptions } from "express";

export const getCookieOptions = (type: 'access' | 'refresh'): CookieOptions => {
    const isProduction = process.env.NODE_ENV === 'production';

    const maxAge = type === 'access'
    ? 15 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge,
    }
}