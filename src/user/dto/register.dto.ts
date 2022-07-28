import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class RegisterDto{
    
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    email: string
    
    @IsNotEmpty()
    @IsString()
    userName: string;
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    password: string;
    /**
     * 사용자 패스워드는 영문대소문자와 숫자 또는 특수문자(!, @, #, $, %, ^, &, *, (, ))로 이루어진 8자 이상 30자 이하의 문자열이어야 한다.
     */
    
    // @IsNotEmpty()
    // @IsString()
    // confirmPassword: string;
    //이걸 굳이 여기서 해야하나? 프론트단에서 하는걸로
}