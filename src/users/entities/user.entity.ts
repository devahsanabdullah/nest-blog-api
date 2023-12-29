import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  emailToken: string;

  @Column({ nullable: true })
  newPasswordToken: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.User)
  posts: Post[];

  @Column({ default: false })
  verify: boolean;

  @CreateDateColumn({ nullable: true })
  create_at: Date;
}
