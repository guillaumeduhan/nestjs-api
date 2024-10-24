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

@Entity({ schema: 'v4', name: 'identities' })
export class Identities {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  legalName: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @Column({ type: 'text', nullable: true, default: 'Individual' })
  entityType?: string;

  @Column({ type: 'text', nullable: true, default: 'None' })
  taxIdType?: string;

  @Column({ type: 'text', nullable: true })
  taxId?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isDisregarded?: boolean;

  @Column({ type: 'text', nullable: true })
  provider?: string;

  @Column({ type: 'text', nullable: true })
  providerId?: string;

  @Column({ type: 'text', nullable: true })
  countryOfCitizenship?: string;

  @Column({ type: 'date', nullable: true })
  dateOfFormation?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'text', nullable: true })
  deletedBy?: string;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  physicalAddressId?: string;

  @Column({ type: 'uuid', nullable: true })
  mailingAddressId?: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @Column({ type: 'text', nullable: true, default: 'pending' })
  status?: string;

  @Column({ type: 'text', nullable: true })
  firstName?: string;

  @Column({ type: 'text', nullable: true })
  middleName?: string;

  @Column({ type: 'text', nullable: true })
  lastName?: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  nickname?: string;

  @Column({ type: 'uuid', nullable: true })
  signerId?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  // Many-to-One relation to reference self (foreign key)
  @ManyToOne(() => Identities)
  @JoinColumn({ name: 'signer_id' })
  signer: Identities;
}
