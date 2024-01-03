import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

 @Column()
 user_id: number;


  @OneToMany(() => Comment, (reply) => reply.parentComment)
  replies: Comment[];

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  parentComment: Comment;

  
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;
 
}