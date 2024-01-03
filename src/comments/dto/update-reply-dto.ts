
import { IsNotEmpty } from 'class-validator';

export class UpdateReplyDto{

    @IsNotEmpty()
    message: string;
    
    @IsNotEmpty()
    replyId: number;

   
}
