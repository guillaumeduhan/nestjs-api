import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ schema: 'public', name: 'entities_taxes' })
export class EntitiesTaxes {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string | null;

  @Column({ type: 'text', name: '1065_files_id', nullable: true })
  '1065FilesId'?: string | null;

  @Column({ type: 'boolean', name: 'agree_costs', default: false })
  agreeCosts: boolean;

  @Column({ type: 'boolean', name: 'agree_msa', default: false })
  agreeMsa: boolean;

  @Column({ type: 'boolean', name: 'agree_setup', default: false })
  agreeSetup: boolean;

  @Column({ type: 'date', name: 'allocations_approval', nullable: true })
  allocationsApproval?: string | null;

  @Column({ type: 'uuid', name: 'batch', nullable: true })
  batch?: number | null;

  @Column({ type: 'float', name: 'entity_beginning_capital', nullable: true })
  entityBeginningCapital?: number;

  @Column({ type: 'float', name: 'entity_beginning_cash', nullable: true })
  entityBeginningCash?: number;

  @Column({ type: 'float', name: 'entity_beginning_current_liabilities', nullable: true })
  entityBeginningCurrentLiabilities?: number;

  @Column({ type: 'float', name: 'entity_beginning_long_term_assets', nullable: true })
  entityBeginningLongTermAssets?: number;

  @Column({ type: 'text', name: 'entity_city', nullable: true })
  entityCity?: string | null;

  @Column({ type: 'float', name: 'entity_capital_contributions', nullable: true })
  entityCapitalContributions?: number;

  @Column({ type: 'float', name: 'entity_cash_distributions', nullable: true })
  entityCashDistributions?: number;

  @Column({ type: 'text', name: 'entity_ein', nullable: true })
  entityEin?: string | null;

  @Column({ type: 'float', name: 'entity_ending_capital', nullable: true })
  entityEndingCapital?: number;

  @Column({ type: 'float', name: 'entity_ending_cash', nullable: true })
  entityEndingCash?: number;

  @Column({ type: 'float', name: 'entity_ending_current_liabilities', nullable: true })
  entityEndingCurrentLiabilities?: number;

  @Column({ type: 'float', name: 'entity_ending_long_term_assets', nullable: true })
  entityEndingLongTermAssets?: number;

  @Column({ type: 'boolean', name: 'entity_has_foreign_investors', default: false })
  entityHasForeignInvestors: boolean;

  @Column({ type: 'text', name: 'entity_name', nullable: true })
  entityName?: string | null;

  @Column({ type: 'text', name: 'entity_phone_number', nullable: true })
  entityPhoneNumber?: string | null;

  @Column({ type: 'float', name: 'entity_portfolio_expense', nullable: true })
  entityPortfolioExpense?: number;

  @Column({ type: 'text', name: 'entity_postal_code', nullable: true })
  entityPostalCode?: string | null;

  @Column({ type: 'text', name: 'entity_satisfies_receipts_and_assets', default: false })
  entitySatisfiesReceiptsAndAssets: boolean;

  @Column({ type: 'text', name: 'entity_state', nullable: true })
  entityState?: string | null;

  @Column({ type: 'text', name: 'entity_street_address', nullable: true })
  entityStreetAddress?: string | null;

  @Column({ type: 'text', name: 'entity_type', nullable: true })
  entityType?: string | null;

  @Column({ type: 'boolean', name: 'extension_filed', default: false })
  extensionFiled: boolean;

  @Column({ type: 'text', name: 'filing_status', nullable: true })
  filingStatus?: string | null;

  @Column({ type: 'text', name: 'fund_manager_approval', nullable: true })
  fundManagerApproval?: boolean;

  @Column({ type: 'text', name: 'fund_manager_approval_date', nullable: true })
  fundManagerApprovalDate?: string | null;

  @Column({ type: 'text', name: 'fund_manager_approval_email', nullable: true })
  fundManagerApprovalEmail?: string | null;

  @Column({ type: 'boolean', name: 'fund_manager_invited', default: false })
  fundManagerInvited: boolean;

  @Column({ type: 'text', name: 'import_state', nullable: true })
  importState?: string | null;

  @Column({ type: 'timestamp with time zone', name: 'import_requested', nullable: true })
  importRequested?: Date;

  @Column({ type: 'boolean', name: 'is_amendment_return', default: false })
  isAmendmentReturn: boolean;

  @Column({ type: 'boolean', name: 'is_final_return', default: false })
  isFinalReturn: boolean;

  @Column({ type: 'boolean', name: 'is_initial_return', default: false })
  isInitialReturn: boolean;

  @Column({ type: 'text', name: 'last_imported_at', nullable: true })
  lastImportedAt?: Date;

  @Column({ type: 'timestamp with time zone', name: 'last_printed_at', nullable: true })
  lastPrintedAt?: Date;

  @Column({ type: 'timestamp with time zone', name: 'print_requested', nullable: true })
  printRequested?: Date;

  @Column({ type: 'text', name: 'partnership_representative_name', nullable: true })
  partnershipRepresentativeName?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_street_address', nullable: true })
  partnershipRepresentativeStreetAddress?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_city', nullable: true })
  partnershipRepresentativeCity?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_zip', nullable: true })
  partnershipRepresentativeZip?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_phone', nullable: true })
  partnershipRepresentativePhone?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_city', nullable: true })
  partnershipRepresentativeDesignatedIndividualCity?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_email', nullable: true })
  partnershipRepresentativeDesignatedIndividualEmail?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_first_name', nullable: true })
  partnershipRepresentativeDesignatedIndividualFirstName?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_last_name', nullable: true })
  partnershipRepresentativeDesignatedIndividualLastName?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_phone', nullable: true })
  partnershipRepresentativeDesignatedIndividualPhone?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_state', nullable: true })
  partnershipRepresentativeDesignatedIndividualState?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_street_address', nullable: true })
  partnershipRepresentativeDesignatedIndividualStreetAddress?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_designated_individual_zip', nullable: true })
  partnershipRepresentativeDesignatedIndividualZip?: string | null;

  @Column({ type: 'text', name: 'partnership_representative_state', nullable: true })
  partnershipRepresentativeState?: string | null;

  @Column({ type: 'uuid', name: 'organization_id', nullable: true })
  organizationId?: string | null;

  @Column({ type: 'text', name: 'provider', nullable: true })
  provider?: string | null;

  @Column({ type: 'text', name: 'provider_id', nullable: true })
  providerId?: string | null;

  @Column({ type: 'text', name: 'signer_first_name', nullable: true })
  signerFirstName?: string | null;

  @Column({ type: 'text', name: 'signer_last_name', nullable: true })
  signerLastName?: string | null;

  @Column({ type: 'text', name: 'signer_signature', nullable: true })
  signerSignature?: string | null;

  @Column({ type: 'text', name: 'signer_title', nullable: true })
  signerTitle?: string | null;

  @Column({ type: 'timestamp with time zone', name: 'signer_signature_date', nullable: true })
  signerSignatureDate?: Date;

  @Column({ type: 'text', name: 'tax_year', nullable: true })
  taxYear?: string | null;

  @Column({ type: 'text', name: 'tax_type', nullable: true })
  taxType?: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at', nullable: true })
  updatedAt?: Date;

  constructor(partial: Partial<EntitiesTaxes> = {}) {
    Object.assign(this, partial);
  }
}
