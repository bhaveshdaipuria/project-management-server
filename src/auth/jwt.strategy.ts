import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
		private configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey:
				configService.get<string>("JWT_SECRET") ||
				"your-super-secret-jwt-key-change-this-in-production",
		});
	}

	async validate(payload: any) {
		console.log("JWT Strategy - Payload:", payload);
		console.log("JWT Strategy - JWT Secret:", process.env.JWT_SECRET);

		if (!payload || !payload.sub) {
			console.log("JWT Strategy - Invalid payload: missing sub");
			return null;
		}

		try {
			const user = await this.authService.validateUser(payload.sub);
			console.log("JWT Strategy - User found:", user);

			if (!user) {
				console.log("JWT Strategy - User not found in database");
				return null;
			}

			console.log("JWT Strategy - Returning user:", user);
			return user;
		} catch (error) {
			console.log("JWT Strategy - Error validating user:", error);
			return null;
		}
	}
}
