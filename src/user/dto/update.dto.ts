import {  } from 'class-validator'

export class UpdateDto{
    
    //히든 값으로 유저아이디가 오는지 알아야한다
    user_id:number;

    email: string
    password: string;
    userName: string;
    
    firstName: string;
    lastName: string;

    createdAt: string;
    updatedAt: string;

    profilePicture: string;
    coverPicture: string;
    about: string;
    livesIn: string;
    worksAt: string;
    relationship: string;
    country: string;
}