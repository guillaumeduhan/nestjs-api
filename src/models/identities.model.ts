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
import { Addresses } from './addresses.model';
import { Deals } from './deals.model';

@Entity({ schema: 'v4', name: 'identities' })
export class Identities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Addresses)
  @JoinColumn({ name: 'address_id' })
  address_id: Addresses;

  @Column({ type: 'text', nullable: true })
  country_of_citizenship?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  created_at?: Date;

  @Column({ type: 'date', nullable: true })
  date_of_formation?: Date;

  @Column({ type: 'text', nullable: true })
  deleted_by?: string;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  entity_type?: string;

  @Column({ type: 'text', nullable: true })
  first_name?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_disregarded?: boolean;

  @Column({ type: 'text', nullable: true })
  last_name?: string;

  @Column({ type: 'text', nullable: false })
  legal_name: string;

  @Column({ type: 'text', nullable: true })
  mailing_address_id?: string;

  @Column({ type: 'text', nullable: true })
  middle_name?: string;

  @Column({ type: 'text', nullable: true })
  nickname?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'uuid', nullable: true })
  physical_address_id?: string;

  @Column({ type: 'text', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true })
  provider_id?: string;

  @Column({ type: 'uuid', nullable: true })
  signer_id?: string;

  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'signer_id' })
  signer: Identities;

  @Column({ type: 'text', nullable: true })
  tax_id?: string;

  @Column({ type: 'text', nullable: true, default: 'None' })
  tax_id_type?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updated_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  updated_by?: string;

  @Column({ type: 'uuid', nullable: true })
  user_id?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  us_domestic?: boolean;

  @Column({ type: 'text', nullable: true, default: 'pending' })
  status?: string;
}

export interface IdentitiesRelations {
  addresses?: Addresses;
  deals?: Deals;
  identity?: IdentitiesRelations;
}

export type IdentitiesWithRelations = Identities & IdentitiesRelations;
