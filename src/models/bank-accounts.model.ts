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

  @Column({ type: 'text', nullable: true })
  accountName?: string;

  @ManyToOne(() => Addresses)
  @JoinColumn({ name: 'address_id' })
  address: Addresses;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'now()', nullable: false })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  otherDetails?: string;

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
  updatedAt: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
