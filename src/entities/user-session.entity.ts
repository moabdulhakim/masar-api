import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";



@Entity("user_sessions")
export class UserSession {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ nullable: true, length: 255 })
    refreshTokenHash: string | null;
    
    @Column()
    userAgent: string;

    @Column({nullable: true})
    ipAddress: string | null;

    @Column({nullable: true})
    location: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=> User, (user)=> user.sessions, {onDelete: 'CASCADE'})
    user: User;
}