import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Deals } from './deals.model';
import { Entities } from './entities.model';

@Entity({ schema: 'v4', name: 'investments_taxes' })
@Check(`tax_year ~ '^[12][0-9]{3}$'`)
export class InvestmentsTaxes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  calculatorVersion?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  createdAt?: Date;

  @ManyToOne(() => Deals)
  @JoinColumn({ name: 'deal_id' })
  deal: Deals;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entity_id' })
  entity: Entities;

  @Column({ type: 'text', nullable: true })
  flaggedByEmail?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  flaggedForUpdateAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  investmentId?: string;

  @Column({ type: 'numeric', nullable: true })
  investorBeginningCapitalAccountAmount?: number;

  @Column({ type: 'numeric', nullable: true })
  investorBeginningCapitalPercentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investorBeginningLossPercentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investorBeginningProfitPercentage?: number;

  @Column({ type: 'text', nullable: true })
  investorCity?: string;

  @Column({ type: 'numeric', nullable: true })
  investorContributions?: number;

  @Column({ type: 'text', nullable: true })
  investorCountry?: string;

  @Column({ type: 'numeric', nullable: true })
  investorCurrentYearNetIncomeLoss?: number;

  @Column({ type: 'date', nullable: true })
  investorDateOfFormation?: Date;

  @Column({ type: 'text', nullable: true })
  investorDisregardedOwnerName?: string;

  @Column({ type: 'text', nullable: true })
  investorDisregardedOwnerTaxId?: string;

  @Column({ type: 'numeric', nullable: true })
  investorDistributions?: number;

  @Column({ type: 'text', nullable: true })
  investorEmail?: string;

  @Column({ type: 'numeric', nullable: true })
  investorEndingCapitalAccountAmount?: number;

  @Column({ type: 'numeric', nullable: true })
  investorEndingCapitalPercentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investorEndingLossPercentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investorEndingProfitPercentage?: number;

  @Column({ type: 'boolean', nullable: true })
  investorEntityIsDisregarded?: boolean;

  @Column({ type: 'text', nullable: true })
  investorEntityType?: string;

  @Column({ type: 'boolean', nullable: true })
  investorFcAndSoiAndDApplicable?: boolean;

  @Column({ type: 'boolean', nullable: true })
  investorForeignTaxCreditLimitationApplicable?: boolean;

  @Column({ type: 'boolean', nullable: true })
  investorIsUsDomestic?: boolean;

  @Column({ type: 'text', nullable: true })
  investorLegalName?: string;

  @Column({ type: 'numeric', nullable: true })
  investorOtherDeductions?: number;

  @Column({ type: 'numeric', nullable: true })
  investorOwnershipPercent?: number;

  @Column({ type: 'text', nullable: true })
  investorPostalCode?: string;

  @Column({ type: 'text', nullable: true })
  investorState?: string;

  @Column({ type: 'text', nullable: true })
  investorStreetAddress?: string;

  @Column({ type: 'text', nullable: true })
  investorTaxId?: string;

  @Column({ type: 'uuid', nullable: true })
  investorIdentitiesId?: string;

  @Column({ type: 'uuid', nullable: true })
  k1FilesId?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastPrintedAt?: Date;

  @Column({ type: 'text', nullable: true })
  legacyRecordId?: string;

  @Column({ type: 'integer', nullable: true })
  partnerIndex?: number;

  @Column({ type: 'numeric', default: 0, nullable: false })
  recordVersion: number;

  @Column({ type: 'text', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  taxYear?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updatedAt?: Date;

  constructor(partial: Partial<InvestmentsTaxes> = {}) {
    Object.assign(this, partial);
  }
}
