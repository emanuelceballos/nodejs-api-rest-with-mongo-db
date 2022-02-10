import express from "express";
import jwt from "jsonwebtoken";
import config from 'config';
import { UnauthorizedError } from '../customErrors/unauthorizedError';
import { ForbiddenError } from "../customErrors/forbiddenError";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "api_key") {

        const token: string =
            request.body.token ||
            request.query.token ||
            request.headers["authorization"];

        return new Promise((resolve, reject) => {

            if (!token) {
                reject(new UnauthorizedError("No token provided"));
            }

            jwt.verify(token, config.get('configToken.seed'), function (err: any, decoded: any) {
                if (err) {
                    reject(err);
                } else {

                    // Check if JWT contains all required scopes
                    if (scopes && scopes.length > 0) {
                        for (let scope of scopes) {
                            if (!decoded.scopes.includes(scope)) {
                                reject(new ForbiddenError("JWT does not contain required scope."));
                            }
                        }
                    }

                    resolve(decoded);
                }
            });
        });
    }

    return new Promise((_resolve, reject) => {
        reject(new Error("Security resolver missconfiguration."));
    });
}
