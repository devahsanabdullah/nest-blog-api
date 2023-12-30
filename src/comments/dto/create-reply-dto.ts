import { IsNotEmpty } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  messsage: string;

  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  commentId: string;
}
