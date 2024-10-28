import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.model';

@Entity({ schema: 'v4', name: 'addresses' })
export class Addresses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  city?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  created_at?: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  deleted_by?: string;

  @Column({ type: 'text', nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  nickname?: string;

  @Column({ type: 'text', nullable: true })
  phone_number?: string;

  @Column({ type: 'text', nullable: true })
  postal_code?: string;

  @Column({ type: 'text', nullable: true })
  region?: string;

  @Column({ type: 'text', nullable: true })
  state?: string;

  @Column({ type: 'text', nullable: true })
  street_address_line1?: string;

  @Column({ type: 'text', nullable: true })
  street_address_line2?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updated_at?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'updated_by' })
  updated_by?: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
