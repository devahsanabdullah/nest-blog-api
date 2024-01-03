import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateReplyDto } from './dto/create-reply-dto';
import { UpdateReplyDto } from './dto/update-reply-dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Post('reply')
   createReply(@Body() createReplyDto: CreateReplyDto) {
    return this.commentsService.createReply(createReplyDto);
   }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

 @Patch()
 updateComment( @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateComment(updateCommentDto);
  }

@Patch('reply')
updateReply( @Body() updateReplyDto: UpdateReplyDto) {
    return this.commentsService.updateReply(updateReplyDto);
  }

  @Delete(':id')
  removeComment(@Param('id') id: string) {
    return this.commentsService.removeComment(+id);
  }


  @Delete('reply/:id')
  removeReply(@Param('id') id: string) {
    return this.commentsService.removeReply(+id);
  }
}
