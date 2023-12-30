import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { CreateReplyDto } from './dto/create-reply-dto';

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
    });
    newComment.post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    const savedComment = await this.useCommentReposiry.save(newComment);
    return savedComment;
  }
  // createReply(createReplyDto: CreateReplyDto)
  // {
  //    const newComment = this.useCommentReposiry.create({
  //     message: createReplyDto.message,
  //   });
  //   newComment.post = this.postRepository.findOne({where:{id:createReplyDto.postId}});
  //   newComment.parent = this.useCommentReposiry.findOne({where:{id:createReplyDto.parentId}});
  //   return this.useCommentReposiry.save(newComment);

  // }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
