import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Investments } from './investments.model';
// import { ClosesInvestments } from './closes-investments.model';
import { Deals, DealsWithRelations } from './deals.model';
import { AssetsWithRelations } from './assets.model';
import { Entities } from './entities.model';
// import { ClosesAssetTransactions } from './closes-asset-transactions.model';
import { Assets } from './assets.model';

@Entity({ name: 'closes', schema: 'public' })
export class Closes {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true, name: 'closed_date' })
  closedDate?: Date;

  @Column({ type: 'timestamp with time zone', nullable: false, name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'deals_id' })
  dealsId: string;

  @ManyToOne(() => Deals, (deal) => deal.closes)
  @JoinColumn({ name: 'deals_id' })
  deal: Deals;

  @Column({ type: 'uuid', nullable: true, name: 'entities_id' })
  entitiesId: string;

  @ManyToOne(() => Entities, (entity) => entity.closes)
  @JoinColumn({ name: 'entities_id' })
  entity: Entities;

  @OneToMany(() => Investments, (investment) => investment.close, { cascade: true })
  investments: Investments[];

  @Column({ type: 'numeric', nullable: false, name: 'portfolio_wire_amount' })
  portfolioWireAmount: number;

  @Column({ type: 'uuid', nullable: true, name: 'organizations_id' })
  organizationsId?: string;

  @Column({ type: 'text', nullable: true, name: 'user_email' })
  userEmail?: string;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId?: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Assets, (asset) => asset.close, { cascade: true })
  assets: AssetsWithRelations[];

  // @OneToMany(() => ClosesAssetTransactions, (closesAssetTransaction) => closesAssetTransaction.close)
  // closesAssetTransactions: ClosesAssetTransactions[];
}
