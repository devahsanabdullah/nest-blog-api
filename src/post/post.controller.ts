import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile, UseInterceptors, Put, UseGuards, Patch
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {AuthGuard} from "../guard/auth.guard";


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post( )
  @UseInterceptors(FileInterceptor('image' , {
    storage : diskStorage({
      destination : "./uploads",
      filename : (req , file , cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalname = file.originalname.replace(/\s/g, '');
        cb(null, `${originalname}`);
      }
    })
  }))
  create(@Body() createPostDto: CreatePostDto,@UploadedFile() file : any,@AuthUser() user: any) {
   
    let image = file.filename;
    let data ={...createPostDto,image}
 
    return this.postService.create(data,user.id);
  }



  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/userpost/:id')
    async getUserPost(@Param('id') id: number) {

  return await this.postService.getUserPost(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image' , {
    storage : diskStorage({
      destination : "./uploads",
      filename : (req , file , cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalname = file.originalname.replace(/\s/g, '');
        cb(null, `${originalname}`);
      }
    })
  }))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto,@UploadedFile() file : any,@AuthUser() user: any) {
    if(file)
    {
      let image = file.filename;
      let data ={...updatePostDto,image}
      return this.postService.update(+id, data,user);
    }
  else{
      return this.postService.update(+id, updatePostDto,user);
  
  }
 
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
