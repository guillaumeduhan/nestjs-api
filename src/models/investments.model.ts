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
import { Deals } from './deals.model';
import { Identities, IdentitiesWithRelations } from './identities.model';
import { InvestmentsTaxes } from './investments-taxes.model';
import { Addresses } from './addresses.model';
import { Closes } from './closes.model';

@Entity({ schema: 'v4', name: 'investments' })
export class Investments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  amount?: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  capitalWiredAmount?: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  carryFeePercentage?: number;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  createdAt?: Date;

  @ManyToOne(() => Closes)
  @JoinColumn({ name: 'closes' })
  closes: Closes;

  @ManyToOne(() => Deals)
  @JoinColumn({ name: 'deal_id' })
  deal: Deals;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deletedBy?: string;

  @Column({ type: 'uuid', nullable: true })
  fileId?: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  eSigned?: boolean;

  @Column({ type: 'uuid', nullable: false })
  identityId: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isArchived?: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isCancelled?: boolean;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  managementFeePercentage?: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  managementFeesDollars?: number;

  @Column({ type: 'text', nullable: true })
  otherDetails?: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  privateFundExpenses?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  searchingText?: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  spvFees?: number;

  @Column({ type: 'text', nullable: true, default: 'Pending' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  templateGoogleDriveId?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  userId?: string;

  @Column({ type: 'integer', nullable: true, default: 1 })
  version?: number;

  constructor(partial: Partial<Investments> = {}) {
    Object.assign(this, partial);
  }
}

export interface InvestmentsRelations {
  // describe navigational properties here
  deal?: Deals;
  close?: Closes;
  identity_id?: IdentitiesWithRelations;
  identity?: IdentitiesWithRelations;
  investmentsTaxes?: InvestmentsTaxes[]
}

export type InvestmentsWithRelations = Investments & InvestmentsRelations;
