import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['task', 'project', 'session', 'sprint'] })
  entity: string;

  @Column()
  label: string;

  @Column()
  color: string;

  @Column()
  level: number;
}
