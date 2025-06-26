import { Project } from 'src/projects/entities/project.entity';
import { Status } from 'src/status/entities/status.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Session } from 'src/sessions/entities/session.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @Column()
  status_id: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @Column({ nullable: true })
  sprint_id: number;

  @ManyToOne(() => Sprint)
  @JoinColumn({ name: 'sprint_id', referencedColumnName: 'id' })
  sprint: Sprint;

  @Column()
  title: string;

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  due_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  points: number;

  @Column({ nullable: true })
  estimated_hours: number;

  @Column({ nullable: true })
  accrued_hours: number;

  @Column({ nullable: true, default: false })
  billable: boolean;

  @Column({ nullable: true })
  billable_hours: number;

  @Column({ nullable: true })
  role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @OneToMany(() => Session, (session) => session.task)
  sessions: Session[];

  @ManyToMany(() => Member)
  @JoinTable()
  members: Member[];
}
