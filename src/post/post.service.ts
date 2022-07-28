import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { take } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post_like.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post) private postRepository:Repository<Post>,
    @InjectRepository(PostLike) private postLikeRepository:Repository<PostLike>,
    private dataSource:DataSource,
  ){}

  async create(postDto: CreatePostDto):Promise<Post> {

    const post = new Post();
    post.desc = postDto.desc;
    post.image = postDto.image;
    post.userId = postDto.userId;

    const result:Post = await this.savePostQueryRunner(post);

    return result;
  }

  async findAll() {
    return `This action returns all post`;
  }

  async findOne(id: number) {

    const post = this.postRepository.findOne(
      {
        where:{id: id}
      }
    );


    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {

    try {
      const post = await this.findOne(id);

      if(post.userId === updatePostDto.userId){
        
        post.desc = updatePostDto.desc;
        post.image = updatePostDto.image;

        const result = this.savePostQueryRunner(post);

        return result;

      }else{
        throw new ForbiddenException('Authentication failed');
      }

    } catch (error) {
      
    }

  }

  async remove(id: number, user:User) {

    const userId = user.id;

    try {
      
      const post = await this.postRepository.findOneBy(
        {
          id:id,
          userId:userId,
        }
      )

      if(post === null){
        throw new ForbiddenException('action forbidden');
      }
        
       await this.postRepository.remove(post);
      

    } catch (error) {
      
      throw error;
      
    }


    return `This action removes a #${id} post`;
  }

  async savePostQueryRunner(post:Post){
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      await queryRunner.manager.save(post);

      await queryRunner.commitTransaction();

      return post;
    } catch (e) {
      console.log(e);
      // throw new InternalServerErrorException("잠시후에 시도해 주세요");

    }finally{

      await queryRunner.release();
    }
    
  }

  async likePost(id: number, user: User){
    if(typeof id == 'string'){
      id = parseInt(id);
    }
    try {
      const postLike = await this.postLikeRepository.findOne(
        {where:{postId:id, userId:user.id}}
        )

        if(postLike === null){
          const newPostLike = new PostLike();
          newPostLike.postId = id;
          newPostLike.userId = user.id;

          await this.postLikeRepository.save(newPostLike);
          return newPostLike;
          
        }else{
          await this.postLikeRepository.remove(postLike);
          return postLike;
        }

    } catch (error) {
      throw new InternalServerErrorException('여기가 문젠가');
      
    }

  }

  async getTimelinePosts(id:number, user){
   
    try {
      const following:number[] = user.followings.map((following)=>{return following.id})
    following.push(user.id);
    // console.log("user", user);
    // console.log("following", following);


    /**
     * post.id join follow_id-following_id join post.id 해서 포스트를 가져온다 
     * 조인 필요없고 팔로잉 유저 아이디값을 배열로 만들어 where IN으로 찾는게 더 간단
     */
    const followingPost = await this.dataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .where("post.userId IN (:...ids)",{ids:following})
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoin('likes.userId','user')
      .addSelect('user.id')
      .orderBy({'post.createdAt': "DESC"})
      .limit(10)
      .getMany()
      
      const posts = followingPost.map((post)=>{

         const likes = post.likes.map((like)=>{
          return like.userId.id;
        })
        post.likes = likes;

        return post;
      })
      


    return posts;
    } catch (error) {
      throw error;
    }
    
  }

}
