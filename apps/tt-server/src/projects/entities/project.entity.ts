import { Account } from 'src/accounts/entities/account.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import { Member } from 'src/members/entities/member.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Status } from 'src/status/entities/status.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status_id: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @Column()
  owner_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  owner: User;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[];

  @Column()
  account_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @Column({ nullable: true })
  primary_contact_id: number;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: 'primary_contact_id', referencedColumnName: 'id' })
  primary_contact: Contact;

  @Column({ nullable: true })
  first_contact: Date;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 8 })
  key: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  estimated_project_start: Date;

  @Column({ nullable: true })
  estimated_project_end: Date;

  @Column({ nullable: true })
  actual_project_start: Date;

  @Column({ nullable: true })
  actual_project_end: Date;

  @Column({ default: true })
  allow_sprints: boolean;

  @Column({ nullable: true })
  project_url: string;

  @Column({ default: true })
  billable: boolean;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Sprint[];

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Member, (member) => member.project)
  members: Member[];
}
