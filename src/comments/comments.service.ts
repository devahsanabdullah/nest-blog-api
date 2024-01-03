import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { CreateReplyDto } from './dto/create-reply-dto';
import { UpdateReplyDto } from './dto/update-reply-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly useCommentReposiry: Repository<Comment>,
    @InjectRepository(Post) public readonly postRepository: Repository<Post>,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.useCommentReposiry.create({
      message: createCommentDto.message,
      user_id: createCommentDto.user_id,
    });
    newComment.created_at = new Date();
    newComment.post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    const savedComment = await this.useCommentReposiry.save(newComment);
    return savedComment;
  }
  async createReply(createReplyDto: CreateReplyDto)
  {
    const parentComment = await this.useCommentReposiry.findOne({
      where: { id: createReplyDto.commentId },
      relations: ['post'],
    });
    if (!parentComment) {
      throw new NotFoundException(`Comment with ID ${createReplyDto.commentId} not found`);
    }


    const reply = this.useCommentReposiry.create({
      user_id: createReplyDto.user_id,
      message:createReplyDto.message,
      post: parentComment.post,
    
      parentComment,
    });
    reply.created_at = new Date();
    return this.useCommentReposiry.save(reply);
 

  }

  findAll(postId: number) {
    return this.useCommentReposiry.find({
      where: { post: { id: postId }, parentComment: { id: IsNull() } }, 
      relations: ['replies'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

 async updateComment( updateCommentDto: UpdateCommentDto) {
  const comment = await this.useCommentReposiry.findOne({
    where: { id:updateCommentDto.commentId },
  });
  if (!comment) {
    throw new NotFoundException(`Comment with ID ${updateCommentDto.commentId}  not found`);
  }

  comment.message = updateCommentDto.message; 
  comment.created_at=new Date;

  return this.useCommentReposiry.save(comment);
  }


 async updateReply( updateReplyDto: UpdateReplyDto) {
  const reply = await this.useCommentReposiry.findOne({
    where: { id: updateReplyDto.replyId },
    relations: ['parentComment'],
  });
 
  
  if (!reply) {
   
    throw new NotFoundException(`Reply with ID ${updateReplyDto.replyId} not found`);
  }
  
  
  reply.message = updateReplyDto.message;
  reply.created_at=new Date;
  return  await this.useCommentReposiry.save(reply);;
  
  }

  removeComment(commentId: number) {
    return this.useCommentReposiry.delete(commentId);
 
  }

  async removeReply(replyId: number) {
    const reply = await this.useCommentReposiry.findOne({
      where: { id: replyId },
      relations: ['parentComment'],
    });
    if (!reply) {
      throw new NotFoundException(`Reply with ID ${replyId} not found`);
    }
    return this.useCommentReposiry.delete(replyId);
  }
}
