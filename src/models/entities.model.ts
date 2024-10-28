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
@Index('idx_entities_user_id', ['user_id'])
@Index('idx_entities_organization_id', ['organization_id'])
@Index('idx_entities_partnership_representative_id', ['partnership_representative_id'])
@Index('idx_entities_partnership_representative_individual_id', ['partnership_representative_individual_id'])
@Index('idx_entities_parent_entity_id', ['parent_entity_id'])
@Index('idx_entities_physical_address_id', ['physical_address_id'])
@Index('idx_entities_mailing_address_id', ['mailing_address_id'])

export class Entities {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'text', nullable: true })
  country_of_formation?: string;

  @CreateDateColumn({ type: 'timestamp without time zone', default: () => 'now()' })
  created_at?: Date;

  @Column({ type: 'date', nullable: true })
  date_of_formation?: Date;

  @Column({ type: 'text', nullable: true })
  deleted_by?: string;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  ein?: string;

  @ManyToOne(() => Deals)
  @JoinColumn({ name: 'deals' })
  deals?: Deals[];

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'fund_manager_identity_id' })
  fund_manager_identity?: Identities;

  @Column({ type: 'uuid', nullable: true })
  identity_id?: string;

  @Column({ type: 'text', nullable: true, default: 'delaware' })
  jurisdiction?: string;

  @Column({ type: 'text', nullable: true })
  legal_name?: string;

  @Column({ type: 'uuid', nullable: true })
  mailing_address_id?: string;

  @Column({ type: 'text', nullable: false })
  name?: string;

  @ManyToOne(() => Organizations)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organizations;

  @Column({ type: 'uuid', nullable: true })
  parent_entity_id?: string;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'partnership_representative_id' })
  partnership_representative?: Identities;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'partnership_representative_individual_id' })
  partnership_representative_individual?: Identities;

  @Column({ type: 'uuid', nullable: true })
  physical_address_id?: string;

  @Column({ type: 'text', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true })
  provider_id?: string;

  @Column({ type: 'text', nullable: true })
  region_of_formation?: string;

  @Column({ type: 'text', nullable: true, default: 'pending' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  structure?: string;

  @Column({ type: 'text', nullable: true })
  taxes_provider?: string;

  @Column({ type: 'text', nullable: true })
  taxes_provider_id?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @UpdateDateColumn({ type: 'timestamp without time zone', default: () => 'now()' })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: false, default: () => 'auth.uid()' })
  user_id?: string;

  @ManyToOne(() => Closes)
  @JoinColumn({ name: 'closes' })
  closes?: Closes;

  constructor(partial: Partial<Entities> = {}) {
    Object.assign(this, partial);
  }
}

export interface EntitiesRelations {
  addresses?: Addresses;
  closes?: Closes[];
  deals?: Deals[];
  entities_taxes?: EntitiesTaxes[];
  entities_taxes_metadata?: any[]; // TODO: missing
  investments_taxes?: InvestmentsTaxes[];
  ledgers?: LedgerWithRelations[];
  organization?: Organizations;
  partnership_representative?: Identities;
  partnership_representative_designated_individual?: Identities;
}

export type EntitiesWithRelations = Entities & EntitiesRelations;
