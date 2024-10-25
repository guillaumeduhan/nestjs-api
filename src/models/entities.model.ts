import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Addresses } from './addresses.model';
import { Closes } from './closes.model';
import { Deals } from './deals.model';
import { EntitiesTaxes } from './entities-taxes.model';
import { Identities } from './identities.model';
import { InvestmentsTaxes } from './investments-taxes.model';
import { LedgerWithRelations } from './ledger.model';
import { Organizations } from './organizations.model';

@Entity({ schema: 'v4', name: 'entities' })
@Index('idx_entities_user_id', ['userId'])
@Index('idx_entities_organization_id', ['organizationId'])
@Index('idx_entities_partnership_representative_id', ['partnershipRepresentativeId'])
@Index('idx_entities_partnership_representative_individual_id', ['partnershipRepresentativeIndividualId'])
@Index('idx_entities_parent_entity_id', ['parentEntityId'])
@Index('idx_entities_physical_address_id', ['physicalAddressId'])
@Index('idx_entities_mailing_address_id', ['mailingAddressId'])

export class Entities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  countryOfFormation?: string;

  @ManyToOne(() => Closes)
  @JoinColumn({ name: 'closes' })
  closes: Closes;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'now()' })
  createdAt?: Date;

  @Column({ type: 'date', nullable: true })
  dateOfFormation?: Date;

  @Column({ type: 'text', nullable: true })
  deletedBy?: string;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'fund_manager_identity_id' })
  fundManagerIdentity: Identities;

  @Column({ type: 'text', nullable: true })
  ein?: string;

  @Column({ type: 'uuid', nullable: true })
  identityId?: string;

  @Column({ type: 'text', nullable: true, default: 'delaware' })
  jurisdiction?: string;

  @Column({ type: 'text', nullable: true })
  legalName?: string;

  @Column({ type: 'uuid', nullable: true })
  mailingAddressId?: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'organization_id' })
  organization: Organizations;

  @Column({ type: 'uuid', nullable: true })
  parentEntityId?: string;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'partnership_representative_id' })
  partnershipRepresentative: Identities;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'partnership_representative_individual_id' })
  partnershipRepresentativeIndividual: Identities;

  @Column({ type: 'uuid', nullable: true })
  physicalAddressId?: string;

  @Column({ type: 'text', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true })
  providerId?: string;

  @Column({ type: 'text', nullable: true })
  regionOfFormation?: string;

  @Column({ type: 'text', nullable: true, default: 'pending' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  structure?: string;

  @Column({ type: 'text', nullable: true })
  taxesProvider?: string;

  @Column({ type: 'text', nullable: true })
  taxesProviderId?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'now()' })
  updatedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @Column({ type: 'uuid', nullable: false, default: () => 'auth.uid()' })
  userId: string;

  constructor(partial: Partial<Entities> = {}) {
    Object.assign(this, partial);
  }
}

export interface EntitiesRelations {
  // describe navigational properties here
  addresses?: Addresses;
  closes?: Closes[];
  deals?: Deals[];
  entitiesTaxes?: EntitiesTaxes[];
  entitiesTaxesMetadata?: any[]; // TODO
  investmentsTaxes?: InvestmentsTaxes[];
  ledgers?: LedgerWithRelations[];
  organization?: Organizations;
  partnershipRepresentative?: Identities;
  partnershipRepresentativeDesignatedIndividual?: Identities;
}

export type EntitiesWithRelations = Entities & EntitiesRelations;
