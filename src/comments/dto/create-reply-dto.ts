import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  commentId: number;
  
  @IsNotEmpty()
  user_id: number;
}
