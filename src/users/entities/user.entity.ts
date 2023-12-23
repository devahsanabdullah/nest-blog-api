
import { Column, Entity, PrimaryGeneratedColumn ,CreateDateColumn} from 'typeorm';

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
    newPasswordToken:string;

    @Column()
    password: string;

    @Column({ default: false })
    verify:boolean;

    @CreateDateColumn({ nullable: true })
    create_at: Date;
}
