import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
};
