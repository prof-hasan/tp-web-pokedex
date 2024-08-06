import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
	expiresIn?: string | number;
}

const secret_key = process.env.SECRET_KEY;

interface UserWithoutPassType {
	id: string;
	name: string | null;
	email: string | null;
	emailVerified: Date | null;
	image: string | null;
}

export function signJwtAccessToken(payload: JwtPayload, options?: SignOption) {
	const token = jwt.sign(payload, secret_key!, options);
	return token;
}

export function validateToken(token: string, id: string) {
	try {
		const decoded = jwt.verify(token, secret_key!) as UserWithoutPassType;

		if (id !== decoded.id) {
			throw "Id de usuário não correspondente";
		}

		return decoded as JwtPayload;
	} catch (error) {
		console.error(error);
		return null;
	}
}
