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
import { Closes } from './closes.model';

@Entity('assets', { schema: 'v4' })
export class Assets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  legal_name: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  subtype: string;

  @Column({ type: 'text', nullable: true })
  location_country: string;

  @Column({ type: 'text', nullable: true })
  portfolio_company_contact_name: string;

  @Column({ type: 'text', nullable: true })
  portfolio_company_phone: string;

  @ManyToOne(() => Closes)
  @JoinColumn({ name: 'closes' })
  closes: Closes;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'now()' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'text', nullable: true })
  deleted_by?: string;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  user_id?: string;

  @Column({ type: 'uuid', nullable: true })
  address_id?: string;

  @Column({ type: 'text', nullable: true })
  website_url?: string;

  @Column({ type: 'text', nullable: true })
  type?: string;

  @Column({ type: 'text', nullable: true })
  security_type?: string;

  @Column({ type: 'text', nullable: true })
  jurisdiction?: string;
}

export interface AssetsRelations {
  closes?: Closes;
}

export type AssetsWithRelations = Assets & AssetsRelations;
