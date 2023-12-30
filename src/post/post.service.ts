import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { promises as fsPromises } from 'fs';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly usePostRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, user: any) {
    const blog = this.usePostRepository.create({
      ...createPostDto,
      User: user,
    });

    try {
      await blog.save();
    } catch (err) {
      throw new InternalServerErrorException('Error creating blog');
    }

    return blog;
  }

  async findAll(page: number, search: string) {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;

    let posts = await this.usePostRepository.find();
    if (search) {
      const searchTerm = search.toLowerCase();
      posts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm),
      );
    }
    const paginatedPosts = posts.slice(startIndex, endIndex);
    return {
      totalPosts: posts.length,
      totalPages: Math.ceil(posts.length / 10),
      currentPage: page,
      posts: paginatedPosts,
    };
  }

  findOne(id: number) {
    return this.usePostRepository.findOne({ where: { id } });
  }

  async getUserPost(id: number) {
    return await this.usePostRepository.find({ where: { User: { id: id } } });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: any) {
    console.log('User id', user);
    const post = await this.usePostRepository.findOne({
      where: { id, User: { id: user.id } },
    });
    if (!post) {
      throw new Error('Post not found');
    }

    if (updatePostDto.image) {
      const filePath = join(__dirname, '../../', 'uploads', post.image);
      console.log('File Path:', filePath);

      if (existsSync(filePath)) {
        await fsPromises.unlink(filePath);
      } else {
        throw new Error('File not found');
      }
    }
    const updatedPost = await this.usePostRepository.update(
      { id },
      updatePostDto,
    );
    return updatedPost;
  }

  async remove(id: number) {
    try {
      const post = await this.usePostRepository.findOne({ where: { id } });

      if (!post) {
        throw new Error('Post not found');
      }

      const filePath = join(__dirname, '../../', 'uploads', post.image);
      console.log('File Path:', filePath);

      if (existsSync(filePath)) {
        await fsPromises.unlink(filePath);
        // await this.usePostRepository.remove(post); // Remove post after file deletion
        return { message: 'File deleted successfully' };
      } else {
        throw new Error('File not found');
      }
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error(`Error while deleting post: ${error.message}`);
    }
  }
}
