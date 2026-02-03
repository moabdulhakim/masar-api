import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 255 })
  refreshTokenHash: string;

  @Column({ length: 255 })
  userAgent: string;

  @Column({ length: 45 })
  ipAddress: string;

  @Column({ length: 255})
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;
}
