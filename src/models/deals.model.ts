import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
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
  id: string;

  @Column({ type: 'boolean', nullable: true })
  advisorForgone?: boolean;

  @Column({ type: 'uuid', nullable: true })
  advisorId?: string;

  @Column({ type: 'boolean', default: true, nullable: true })
  agreeMsa?: boolean;

  @Column({ type: 'text', nullable: true })
  availableNetworks?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  carryFee?: number;

  @Column({ type: 'date', nullable: true })
  closingDate?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  createdAt?: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  deletedBy?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  depositFee?: number;

  @Column({ type: 'text', nullable: true })
  documentsProvider?: string;

  @Column({ type: 'text', nullable: true })
  documentsProviderId?: string;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entity_id' })
  entity: Entities;

  @Column({ type: 'date', nullable: true })
  estimatedClosingDate?: Date;

  @Column({ type: 'uuid', nullable: true })
  fundManagerId?: string;

  @Column({ type: 'numeric', default: 0, nullable: true })
  lockupPeriod?: number;

  @Column({ type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  managementFee?: number;

  @Column({ type: 'text', default: 'none', nullable: true })
  managementFeeFrequency?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  managementFeePercent?: number;

  @Column({ type: 'numeric', nullable: true })
  maximumInvestmentAmount?: number;

  @Column({ type: 'text', nullable: true })
  memo?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0, nullable: true })
  minimumInvestmentAmount?: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  multiAsset?: boolean;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', default: '506b', nullable: true })
  offeringType?: string;

  @Column({ type: 'text', nullable: true })
  portfolioCompany?: string;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'identity_id' })
  identity: Identities;

  @Column({ type: 'boolean', default: false, nullable: true })
  public?: boolean;

  @Column({ type: 'text', nullable: true })
  shortMemo?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  signingDate?: Date;

  @Column({ type: 'text', nullable: true })
  source?: string;

  @Column({ type: 'text', default: 'draft', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  tagLine?: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0, nullable: true })
  targetRaiseAmount?: number;

  @Column({ type: 'text', nullable: true })
  templateGoogleDriveId?: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0, nullable: true })
  totalCarry?: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'uuid', default: () => 'auth.uid()', nullable: true })
  userId?: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organizations;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @Column({ type: 'text', default: 'Micro SPV', nullable: true })
  productType?: string;

  @Column({ type: 'text', default: 'Accredited Investors (3c1)', nullable: true })
  investorType?: string;

  @Column({ type: 'text', default: 'None', nullable: true })
  financialStatements?: string;

  @ManyToOne(() => BankAccounts)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccounts;

  @OneToMany(() => Closes, (close) => close.deal)
  closes?: Closes[];
}


export interface DealsRelations {
  // describe navigational properties here
  investments?: Investments[];
  closes?: Closes[];
  assets?: Assets[];
  entity?: Entities;
  organization?: Organizations;
  fmIdentity?: Identities;
}

export type DealsWithRelations = Deals & DealsRelations;
