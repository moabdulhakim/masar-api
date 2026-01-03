import { IsString, MaxLength } from "class-validator";


export class RefreshTokenDto {
    @IsString()
    @MaxLength(150)
    accessToken: string;
}