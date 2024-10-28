import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assets, AssetsWithRelations } from './assets.model';
import { Deals } from './deals.model';
import { Entities } from './entities.model';
import { Investments } from './investments.model';

@Entity({ name: 'closes', schema: 'public' })
export class Closes {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToMany(() => Assets, (asset) => asset.closes, { cascade: true })
  assets?: AssetsWithRelations[];

  @Column({ type: 'date', nullable: true, name: 'closed_date', default: () => 'CURRENT_TIMESTAMP' })
  closed_date?: Date;

  @Column({ type: 'timestamp with time zone', nullable: false, name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @ManyToOne(() => Deals, (deal) => deal.closes)
  @JoinColumn({ name: 'deals_id' })
  deal?: Deals;

  @Column({ type: 'uuid', nullable: true, name: 'deals_id' })
  deals_id?: string;

  @Column({ type: 'uuid', nullable: true, name: 'entities_id' })
  entities_id?: string;

  @OneToMany(() => Entities, (entity) => entity.closes, { cascade: true })
  @JoinColumn({ name: 'entities_id' })
  entity?: Entities;

  @OneToMany(() => Investments, (investment) => investment.closes, { cascade: true })
  investments?: Investments[];

  @Column({ type: 'uuid', nullable: true, name: 'organizations_id' })
  organizations_id?: string;

  @Column({ type: 'numeric', nullable: false, name: 'portfolio_wire_amount' })
  portfolio_wire_amount?: number;

  @Column({ type: 'text', nullable: true, name: 'user_email' })
  user_email?: string;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  user_id?: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}

export interface ClosesRelations {
  investments?: Investments[];
}

export type ClosesWithRelations = Closes & ClosesRelations;
