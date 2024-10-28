import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'entities_taxes' })
export class EntitiesTaxes {
  @Column({ type: 'boolean', name: 'agree_costs', default: false })
  agree_costs: boolean;

  @Column({ type: 'boolean', name: 'agree_msa', default: false })
  agree_msa: boolean;

  @Column({ type: 'boolean', name: 'agree_setup', default: false })
  agree_setup: boolean;

  @Column({ type: 'date', name: 'allocations_approval', nullable: true })
  allocations_approval?: string | null;

  @Column({ type: 'uuid', name: 'batch', nullable: true })
  batch?: number | null;

  @Column({ type: 'text', name: 'calculator_version', nullable: true })
  calculator_version?: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', nullable: true })
  created_at?: Date;

  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string | null;

  @Column({ type: 'text', name: 'entity_city', nullable: true })
  entity_city?: string | null;

  @Column({ type: 'float', name: 'entity_beginning_capital', nullable: true })
  entity_beginning_capital?: number;

  @Column({ type: 'float', name: 'entity_beginning_cash', nullable: true })
  entity_beginning_cash?: number;

  @Column({ type: 'float', name: 'entity_beginning_current_liabilities', nullable: true })
  entity_beginning_current_liabilities?: number;

  @Column({ type: 'float', name: 'entity_beginning_long_term_assets', nullable: true })
  entity_beginning_long_term_assets?: number;

  @Column({ type: 'float', name: 'entity_capital_contributions', nullable: true })
  entity_capital_contributions?: number;

  @Column({ type: 'float', name: 'entity_cash_distributions', nullable: true })
  entity_cash_distributions?: number;

  @Column({ type: 'text', name: 'entity_ein', nullable: true })
  entity_ein?: string | null;

  @Column({ type: 'float', name: 'entity_ending_capital', nullable: true })
  entity_ending_capital?: number;

  @Column({ type: 'float', name: 'entity_ending_cash', nullable: true })
  entity_ending_cash?: number;

  @Column({ type: 'float', name: 'entity_ending_current_liabilities', nullable: true })
  entity_ending_current_liabilities?: number;

  @Column({ type: 'float', name: 'entity_ending_long_term_assets', nullable: true })
  entity_ending_long_term_assets?: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'entity_formation_date', nullable: true })
  entity_formation_date?: Date;

  @PrimaryGeneratedColumn('uuid', { name: 'entity_id' })
  entity_id?: string | null;

  @Column({ type: 'boolean', name: 'entity_has_foreign_investors', default: false })
  entity_has_foreign_investors: boolean;

  @Column({ type: 'text', name: 'entity_name', nullable: true })
  entity_name?: string | null;

  @Column({ type: 'text', name: 'entity_phone_number', nullable: true })
  entity_phone_number?: string | null;

  @Column({ type: 'float', name: 'entity_portfolio_expense', nullable: true })
  entity_portfolio_expense?: number;

  @Column({ type: 'text', name: 'entity_postal_code', nullable: true })
  entity_postal_code?: string | null;

  @Column({ type: 'boolean', name: 'entity_satisfies_receipts_and_assets', default: false })
  entity_satisfies_receipts_and_assets: boolean;

  @Column({ type: 'text', name: 'entity_state', nullable: true })
  entity_state?: string | null;

  @Column({ type: 'text', name: 'entity_street_address', nullable: true })
  entity_street_address?: string | null;

  @Column({ type: 'text', name: 'entity_type', nullable: true })
  entity_type?: string | null;

  @Column({ type: 'boolean', name: 'extension_filed', default: false })
  extension_filed: boolean;

  @Column({ type: 'text', name: 'filing_status', nullable: true })
  filing_status?: string | null;

  @Column({ type: 'boolean', name: 'fund_manager_approval', nullable: true })
  fund_manager_approval?: boolean;

  @Column({ type: 'date', name: 'fund_manager_approval_date', nullable: true })
  fund_manager_approval_date?: string | null;

  @Column({ type: 'text', name: 'fund_manager_approval_email', nullable: true })
  fund_manager_approval_email?: string | null;

  @Column({ type: 'boolean', name: 'fund_manager_invited', default: false })
  fund_manager_invited: boolean;

  @Column({ type: 'text', name: 'import_state', nullable: true })
  import_state?: string | null;

  @Column({ type: 'timestamp with time zone', name: 'import_requested', nullable: true })
  import_requested?: Date;

  @Column({ type: 'boolean', name: 'is_amendment_return', default: false })
  is_amendment_return: boolean;

  @Column({ type: 'boolean', name: 'is_final_return', default: false })
  is_final_return: boolean;

  @Column({ type: 'boolean', name: 'is_initial_return', default: false })
  is_initial_return: boolean;

  @Column({ type: 'timestamp with time zone', name: 'last_imported_at', nullable: true })
  last_imported_at?: Date;

  @Column({ type: 'timestamp with time zone', name: 'last_printed_at', nullable: true })
  last_printed_at?: Date;

  @Column({ type: 'timestamp with time zone', name: 'print_requested', nullable: true })
  print_requested?: Date;

  @Column({ type: 'text', name: 'partnership_representative_name', nullable: true })
  partnership_representative_name?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_street_address', nullable: true })
  partnership_representative_street_address?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_city', nullable: true })
  partnership_representative_city?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_zip', nullable: true })
  partnership_representative_zip?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_phone', nullable: true })
  partnership_representative_phone?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_city', nullable: true })
  partnership_representative_designated_individual_city?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_email', nullable: true })
  partnership_representative_designated_individual_email?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_first_name', nullable: true })
  partnership_representative_designated_individual_first_name?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_last_name', nullable: true })
  partnership_representative_designated_individual_last_name?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_phone', nullable: true })
  partnership_representative_designated_individual_phone?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_state', nullable: true })
  partnership_representative_designated_individual_state?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_street_address', nullable: true })
  partnership_representative_designated_individual_street_address?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_zip', nullable: true })
  partnership_representative_designated_individual_zip?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_state', nullable: true })
  partnership_representative_state?: string | null;

  @Column({ type: 'uuid', name: 'organization_id', nullable: true })
  organization_id?: string | null;

  @Column({ type: 'text', name: 'provider', nullable: true })
  provider?: string | null;

  @Column({ type: 'text', name: 'provider_id', nullable: true })
  provider_id?: string | null;

  @Column({ type: 'text', name: 'signer_first_name', nullable: true })
  signer_first_name?: string | null;

  @Column({ type: 'text', name: 'signer_last_name', nullable: true })
  signer_last_name?: string | null;

  @Column({ type: 'text', name: 'signer_signature', nullable: true })
  signer_signature?: string | null;

  @Column({ type: 'text', name: 'signer_title', nullable: true })
  signer_title?: string | null;

  @Column({ type: 'timestamp with time zone', name: 'signer_signature_date', nullable: true })
  signer_signature_date?: Date;

  @Column({ type: 'text', name: 'tax_year', nullable: true })
  tax_year?: string | null;

  @Column({ type: 'text', name: 'tax_type', nullable: true })
  tax_type?: string | null;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true })
  updated_at?: Date;

  @Column({ type: 'text', name: '1065_files_id', nullable: true })
  '1065_files_id'?: string | null;

  constructor(partial: Partial<EntitiesTaxes> = {}) {
    Object.assign(this, partial);
  }
}
