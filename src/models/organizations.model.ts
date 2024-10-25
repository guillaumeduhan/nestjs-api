import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'v4', name: 'organizations' })
export class Organizations {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'now()', nullable: false })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'uuid', nullable: true, default: () => 'auth.uid()' })
  userId?: string;
}
