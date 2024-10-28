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
  calculator_version?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  created_at?: Date;

  @ManyToOne(() => Deals)
  @JoinColumn({ name: 'deal_id' })
  deal: Deals;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entity_id' })
  entity: Entities;

  @Column({ type: 'text', nullable: true })
  flagged_by_email?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  flagged_for_update_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  investment_id?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_beginning_capital_account_amount?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_beginning_capital_percentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_beginning_loss_percentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_beginning_profit_percentage?: number;

  @Column({ type: 'text', nullable: true })
  investor_city?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_contributions?: number;

  @Column({ type: 'text', nullable: true })
  investor_country?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_current_year_net_income_loss?: number;

  @Column({ type: 'date', nullable: true })
  investor_date_of_formation?: Date;

  @Column({ type: 'text', nullable: true })
  investor_disregarded_owner_name?: string;

  @Column({ type: 'text', nullable: true })
  investor_disregarded_owner_tax_id?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_distributions?: number;

  @Column({ type: 'text', nullable: true })
  investor_email?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_ending_capital_account_amount?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_ending_capital_percentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_ending_loss_percentage?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_ending_profit_percentage?: number;

  @Column({ type: 'boolean', nullable: true })
  investor_entity_is_disregarded?: boolean;

  @Column({ type: 'text', nullable: true })
  investor_entity_type?: string;

  @Column({ type: 'boolean', nullable: true })
  investor_fc_and_soi_and_d_applicable?: boolean;

  @Column({ type: 'boolean', nullable: true })
  investor_foreign_tax_credit_limitation_applicable?: boolean;

  @Column({ type: 'boolean', nullable: true })
  investor_is_us_domestic?: boolean;

  @Column({ type: 'text', nullable: true })
  investor_legal_name?: string;

  @Column({ type: 'numeric', nullable: true })
  investor_other_deductions?: number;

  @Column({ type: 'numeric', nullable: true })
  investor_ownership_percent?: number;

  @Column({ type: 'text', nullable: true })
  investor_postal_code?: string;

  @Column({ type: 'text', nullable: true })
  investor_state?: string;

  @Column({ type: 'text', nullable: true })
  investor_street_address?: string;

  @Column({ type: 'text', nullable: true })
  investor_tax_id?: string;

  @Column({ type: 'uuid', nullable: true })
  investor_identities_id?: string;

  @Column({ type: 'uuid', nullable: true })
  k1_files_id?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  last_printed_at?: Date;

  @Column({ type: 'text', nullable: true })
  legacy_record_id?: string;

  @Column({ type: 'integer', nullable: true })
  partner_index?: number;

  @Column({ type: 'numeric', default: 0, nullable: false })
  record_version: number;

  @Column({ type: 'text', nullable: true })
  status?: string;

  @Column({ type: 'text', nullable: true })
  tax_year?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updated_at?: Date;

  constructor(partial: Partial<InvestmentsTaxes> = {}) {
    Object.assign(this, partial);
  }
}
