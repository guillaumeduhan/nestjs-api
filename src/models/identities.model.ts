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
  addressId: Addresses;

  @Column({ type: 'text', nullable: true })
  countryOfCitizenship?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  createdAt?: Date;

  @Column({ type: 'text', nullable: true })
  deletedBy?: string;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'text', nullable: true, default: 'pending' })
  status?: string;

  @Column({ type: 'date', nullable: true })
  dateOfFormation?: Date;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  entityType?: string;

  @Column({ type: 'text', nullable: true })
  firstName?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isDisregarded?: boolean;

  @Column({ type: 'text', nullable: true })
  lastName?: string;

  @Column({ type: 'text', nullable: false })
  legalName: string;

  @Column({ type: 'text', nullable: true })
  mailingAddressId?: string;

  @Column({ type: 'text', nullable: true })
  middleName?: string;

  @Column({ type: 'text', nullable: true })
  nickname?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'uuid', nullable: true })
  physicalAddressId?: string;

  @Column({ type: 'text', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true })
  providerId?: string;

  @Column({ type: 'text', nullable: true })
  taxId?: string;

  @Column({ type: 'text', nullable: true, default: 'None' })
  taxIdType?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  usDomestic?: boolean;

  @Column({ type: 'uuid', nullable: true })
  signerId?: string;

  // Many-to-One relation to reference self (foreign key)
  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'signer_id' })
  signer: Identities;
}

export interface IdentitiesRelations {
  // describe navigational properties here
  addresses?: Addresses;
  deal?: Deals;
  identity?: IdentitiesRelations;
}

export type IdentitiesWithRelations = Identities & IdentitiesRelations;