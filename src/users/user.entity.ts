import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
  
  @Column()
  role!: string;

  @CreateDateColumn()
  created_at!: Date;
}
