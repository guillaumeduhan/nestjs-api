import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entities } from './entities.model';
import { LedgerCategories } from './ledger-categories.model';

@Entity({ schema: 'public', name: 'ledger' })
export class Ledger {
  @ManyToOne(() => LedgerCategories)
  @JoinColumn({ name: 'ledger_categories_id' })
  ledger_categories_id: LedgerCategories;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: false })
  created_at?: Date;

  @Column({ type: 'boolean', nullable: false })
  debit: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entities_id' })
  entity: Entities;

  @Column({ type: 'timestamp with time zone', nullable: false, default: () => 'now()' })
  entry_date: Date;

  @Column({ type: 'numeric', nullable: false })
  subscription_amount: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'now()' })
  updated_at?: Date;
}

export interface LedgerRelations {
  entity?: Entities;
  category?: LedgerCategories;
}

export type LedgerWithRelations = Ledger & LedgerRelations;
