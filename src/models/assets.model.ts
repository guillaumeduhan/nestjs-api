import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('assets', { schema: 'v4' })
export class Assets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  legalName: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  subtype: string;

  @Column({ type: 'text', nullable: true })
  locationCountry: string;

  @Column({ type: 'text', nullable: true })
  portfolioCompanyContactName: string;

  @Column({ type: 'text', nullable: true })
  portfolioCompanyPhone: string;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date;

  @Column({ type: 'text', nullable: true })
  deletedBy: string;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  addressId: string;

  @Column({ type: 'text', nullable: true })
  websiteUrl: string;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  securityType: string;

  @Column({ type: 'text', nullable: true })
  jurisdiction: string;
}

export interface AssetsRelations {
  close?: any;
  // describe navigational properties here
}

export type AssetsWithRelations = Assets & AssetsRelations;
