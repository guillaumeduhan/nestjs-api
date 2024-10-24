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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', nullable: false })
  amount: number;

  @Column({ type: 'boolean', nullable: false })
  debit: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: false })
  createdAt: Date;

  @ManyToOne(() => LedgerCategories)
  @JoinColumn({ name: 'categories_id' })
  category: LedgerCategories;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Entities)
  @JoinColumn({ name: 'entities_id' })
  entity: Entities;

  @Column({ type: 'timestamp with time zone', nullable: false, default: () => 'now()' })
  entryDate: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'now()' })
  updatedAt: Date;
}

export interface LedgerRelations {
  // describe navigational properties here
  entity: Entities;
  category: LedgerCategories;
}

export type LedgerWithRelations = Ledger & LedgerRelations;
