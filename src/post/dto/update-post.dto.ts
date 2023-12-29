import { IsOptional } from 'class-validator';

export class UpdatePostDto  {
    @IsOptional()
    title: string;
  
    @IsOptional()
    description: string;
  
    @IsOptional()
    image: string;
}
