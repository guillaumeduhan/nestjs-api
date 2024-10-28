import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Addresses } from './addresses.model';
import { Organizations } from './organizations.model';
import { Users } from './users.model';

@Entity({ schema: 'v4', name: 'bank_accounts' })
export class BankAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Addresses)
  @JoinColumn({ name: 'address_id' })
  address: Addresses;

  @Column({ type: 'text', nullable: true })
  account_name?: string;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'now()', nullable: false })
  created_at?: Date;

  @Column({ type: 'text', nullable: true })
  other_details?: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organizations;

  @Column({ type: 'text', default: 'Layer2', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true, default: 'Pending' })
  status?: string;

  @Column({ type: 'text', nullable: true, default: 'USD' })
  type?: string;

  @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'now()', nullable: false })
  updated_at?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'updated_by' })
  updated_by?: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
