import { Injectable, UnprocessableEntityException, NotFoundException, BadRequestException, UnauthorizedException, InternalServerErrorException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LogInDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { UpdateDto } from './dto/update.dto';
import { Follow } from 'src/follow/entity/follow.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    private dataSource: DataSource,
    ){};

    //**유저 있는지 확인용 */
  async checkUser(email:string):Promise<boolean>{

    const user = await this.userRepository.findOne({where:{email: email}});

    return user !== null;
  }

  //**유저 검색(로그인용) */
  async getUserByEmail(logInDto:LogInDto):Promise<any>{
    const userCheck = await this.checkUser(logInDto.email);

    if(!userCheck){
      throw new NotFoundException('없는 이메일입니다');
    }

    const user = await this.userRepository.findOne({
      // relations:['userInfo'], //연관,join으로 검색할때
      where:{
        email:logInDto.email, // bcrypt적용후 어떻게 할것인지 생각
      }
    })

    if(await bcrypt.compare(logInDto.password, user.password)){
      return user;

    }else{
      throw new UnauthorizedException('비밀번호가 틀립니다');
    }


  }

  //**유저 생성 */
  async createUser(registerDto: RegisterDto):Promise<any>{
    console.log('createUser');
    const userExist = await this.checkUser(registerDto.email);

    if(userExist){
      throw new UnprocessableEntityException('이미 존재하는 이메일입니다');
    }

    //await this.saveUserTransaction(registerDto);
    const {password, ...user} = await this.saveUserQueryRunner(registerDto);



    return user;
  }

  //**쿼리러너를 이용한 트랜잭션 */
  async saveUserQueryRunner(registerDto: RegisterDto){
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const salt = await bcrypt.genSalt();
    const hashedPasswd = await this.generatePassword(registerDto.password);
    

    try {
      const user = new User();
      user.firstName = registerDto.firstName;
      user.lastName = registerDto.lastName;
      user.userName = registerDto.userName;
      
      user.email = registerDto.email;
      user.password = hashedPasswd;
      

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      return user;

    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      console.log(error);

    }finally{
      await queryRunner.release();
    }

  }

  //**쿼리러너안의 트랜잭션 객체를 이용한 트랜잭션 */
  async saveUserTransaction(registerDto: RegisterDto){
      await this.dataSource.transaction(async manager=>{

        const hashedPasswd = await this.generatePassword(registerDto.password);
        
        const user = new User();
        user.firstName = registerDto.firstName;
        user.lastName = registerDto.lastName;
        user.userName = registerDto.userName;
      
        user.email = registerDto.email;
        user.password = hashedPasswd;

       await manager.save(user);

        return user;
      })
  }

  //아이디로 검색
  async getById(id:number){
    const user:User = await this.userRepository.findOne({where:{id: id}}); //**이거 왜 안되냐, 테이블 수정 안해서

      if(user === null){
        throw new NotFoundException('no such user');
      }else{
        
        return user;
      }
  }
  //유저정보에서 비밀번호 제거후 리턴
  async getUserById(userId:number){

    const user = await this.getById(userId);
    
    const {password, ...userInfo}= user;

    return userInfo;
  }


  async getAllUsers(userName:string='', skip:number=0, take:number=30){

    let findOption={
      where:{},
      take:take,
      skip:skip,
      };

    if(userName ===''){
      delete findOption.where
    }

    try {
      // const users:User[] = await this.userRepository.find(findOption); //밑에거 간편한 버젼?
      // const users:User[] = await this.userRepository.find({
      //   where:{userName: userName},
      //   take:take,
      // }); //이거 몇개씩 가져올건지
      
      //비밀번호는 빼고 뿌려야함
      // const tUsers = users.map((user) => {
      //   const {password, ...userInfo} = user;
      //   return userInfo;
      // });

      const tUsers = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('user.userName')
        .addSelect('user.firstName')
        .addSelect('user.lastName')
        .addSelect('user.profilePicture')
        
        .innerJoinAndSelect('user.followers','followers')
        .innerJoin('followers.follower','follower_user')
        .addSelect('follower_user.id')  
        .addSelect('follower_user.userName')
        .getMany()

        tUsers.map((user)=>{
          const temp = user.followers.map((follower)=>{
            return follower.follower.id;
          })
          user.followers = temp;
          return user;
        })





      return tUsers;

    } catch (error) {
      throw new NotFoundException('no such user');
    }

  }

  async updateUser(updateDto:UpdateDto, _id:number, user){
    
    if(_id !== user.id){
      throw new ForbiddenException('access denied');
    }else{

      if(updateDto.password){ //비번이 있다면 바꾸기
        updateDto.password = await this.generatePassword(updateDto.password);
      }

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.update(User, user.id, user);
  
        await queryRunner.commitTransaction();
  
        return user;
  
      } catch (error) {
        
        await queryRunner.rollbackTransaction();
        console.log(error);
  
      }finally{
        await queryRunner.release();
      }
      
    }


  }

  async deleteUser(_id:number, user){

    if(_id === user.id){
      throw new ForbiddenException('access denied');
    }else{
      
      this.dataSource.transaction(async manager=>{
  
        manager.delete(User, user.id);
      })
    }


  }

  async generatePassword(password:string){
    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(password, salt);

    return hashedPasswd;
  }

  async followUser(id:number, user:User){
    if(id === user.id){
      throw new ForbiddenException('Action forbidden');
    }else{
      try {
        /**
         * 일단 이미 팔로우를 했는지 검사해야함
         */

        const check = await this.followRepository.findOne({
          where:{
            follower:user.id,
            following:id
          }
        });
        
        if(check){
          return 'already folloing user'
        }

         
        const follow = new Follow();
        follow.follower = user.id;
        follow.following = id;
        await this.followRepository.save(follow);

        return "user followed";

      } catch (error) {
        throw new InternalServerErrorException(error);
      }

    }

  }

  async unfollowUser(id:number, user:User){

    if(id === user.id){
      throw new ForbiddenException("Action forbidden");
    }else{
      try {
        const follow = await this.followRepository.findOne({where:{
          follower: user.id,
          following: id
        }});

        if(!follow){
          throw new ForbiddenException();
          return 'not following user'
        }
        await this.followRepository.remove(follow);
        return "user unfollowed";

      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }

  }

}
