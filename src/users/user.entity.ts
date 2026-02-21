import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from "src/common/base/base.entity";

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
  
  @Column()
  role!: string;
}
