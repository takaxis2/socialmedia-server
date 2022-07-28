import { IsString, MinLength, MaxLength, IsNotEmpty, Matches, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class LogInDto {

    // @IsString()
    // @Transform(({value})=>JSON.stringify(value))
    @MinLength(1)
    @MaxLength(20)
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    // @IsString()
    // @Transform(({value})=>JSON.stringify(value))
    @MinLength(8)
    @MaxLength(30)
    @IsNotEmpty()
    @Matches(/^[A-Za-z\d!@#$%^&*()]*$/, {
        message: 'password only accepts english, number and symbols'
    })
    password:string;

}
