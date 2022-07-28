export class CreatePostDto {

    //이미지 경로도 필요할 듯(이미지 이름이 들어올 수도 있다) entity도 고칠것
    image:string;

    desc:string;

    userId:number;
}
