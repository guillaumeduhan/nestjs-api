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
import { Closes } from './closes.model';
import { Deals } from './deals.model';
import { IdentitiesWithRelations } from './identities.model';
import { InvestmentsTaxes } from './investments-taxes.model';

@Entity({ schema: 'v4', name: 'investments' })
export class Investments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  capital_wired_amount?: number;

  @ManyToOne(() => Closes)
  @JoinColumn({ name: 'closes' })
  closes?: Closes;

  @ManyToOne(() => Deals)
  @JoinColumn({ name: 'deal_id' })
  deal?: Deals;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deleted_by?: string;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  file_id?: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  e_signed?: boolean;

  @Column({ type: 'uuid', nullable: false })
  identity_id?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_archived?: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_cancelled?: boolean;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  carry_fee_percentage?: number;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  created_at?: Date;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  management_fee_percentage?: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  management_fees_dollars?: number;

  @Column({ type: 'text', nullable: true })
  other_details?: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  private_fund_expenses?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  searching_text?: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  spv_fees?: number;

  @Column({ type: 'text', nullable: true, default: 'Pending' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  template_google_drive_id?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  user_id?: string;

  @Column({ type: 'integer', nullable: true, default: 1 })
  version?: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  subscription_amount?: number;

  constructor(partial: Partial<Investments> = {}) {
    Object.assign(this, partial);
  }
}

export interface InvestmentsRelations {
  deal?: Deals;
  close?: Closes;
  identity_id?: IdentitiesWithRelations;
  identity?: IdentitiesWithRelations;
  investments_taxes?: InvestmentsTaxes[];
}

export type InvestmentsWithRelations = Investments & InvestmentsRelations;
