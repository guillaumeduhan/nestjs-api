import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assets } from './assets.model';
import { BankAccounts } from './bank-accounts.model';
import { Closes } from './closes.model';
import { Entities } from './entities.model';
import { Identities } from './identities.model';
import { Investments } from './investments.model';
import { Organizations } from './organizations.model';

@Entity({ schema: 'v4', name: 'deals' })
@Check(`source IN ('platform', 'migration')`)
export class Deals {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'boolean', nullable: true })
  advisor_forgone?: boolean;

  @Column({ type: 'uuid', nullable: true })
  advisor_id?: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  agree_msa?: boolean;

  @Column({ type: 'text', nullable: true })
  available_networks?: string;

  @ManyToOne(() => BankAccounts)
  @JoinColumn({ name: 'bank_account_id' })
  bank_account?: BankAccounts;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  carry_fee?: number;

  @Column({ type: 'date', nullable: true })
  closing_date?: Date;

  @OneToMany(() => Closes, (close) => close.deal)
  closes?: Closes[];

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  created_at?: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  deleted_by?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  deposit_fee?: number;

  @Column({ type: 'text', nullable: true })
  documents_provider?: string;

  @Column({ type: 'text', nullable: true })
  documents_provider_id?: string;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entity_id' })
  entity?: Entities;

  @Column({ type: 'date', nullable: true })
  estimated_closing_date?: Date;

  @Column({ type: 'text', default: 'None', nullable: true })
  financial_statements?: string;

  @Column({ type: 'uuid', nullable: true })
  fund_manager_id?: string;

  @Column({ type: 'text', default: 'Accredited Investors (3c1)', nullable: true })
  investor_type?: string;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'identity_id' })
  identity?: Identities;

  @Column({ type: 'numeric', default: 0, nullable: true })
  lockup_period?: number;

  @Column({ type: 'text', nullable: true })
  logo_url?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  management_fee?: number;

  @Column({ type: 'text', default: 'none', nullable: true })
  management_fee_frequency?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  management_fee_percent?: number;

  @Column({ type: 'numeric', nullable: true })
  maximum_investment_amount?: number;

  @Column({ type: 'text', nullable: true })
  memo?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0, nullable: true })
  minimum_investment_amount?: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  multi_asset?: boolean;

  @Column({ type: 'text', nullable: false })
  name?: string;

  @Column({ type: 'text', default: '506b', nullable: true })
  offering_type?: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organizations;

  @Column({ type: 'text', nullable: true })
  portfolio_company?: string;

  @Column({ type: 'text', default: 'Micro SPV', nullable: true })
  product_type?: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  public?: boolean;

  @Column({ type: 'text', nullable: true })
  short_memo?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  signing_date?: Date;

  @Column({ type: 'text', nullable: true })
  source?: string;

  @Column({ type: 'text', default: 'draft', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  tag_line?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0, nullable: true })
  target_raise_amount?: number;

  @Column({ type: 'text', nullable: true })
  template_google_drive_id?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  total_carry?: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', default: () => 'auth.uid()', nullable: true })
  user_id?: string;

  @Column({ type: 'text', nullable: true })
  website_url?: string;
}

export interface DealsRelations {
  investments?: Investments[];
  closes?: Closes[];
  assets?: Assets[];
  entity?: Entities;
  organization?: Organizations;
  fund_manager_id?: Identities;
}

export type DealsWithRelations = Deals & DealsRelations;
