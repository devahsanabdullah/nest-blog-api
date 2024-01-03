import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto{

    @IsNotEmpty()
    message: string;
    
    @IsNotEmpty()
    commentId: number;

   
}
