import { Status } from 'src/status/entities/status.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column()
  task_id: number;

  @ManyToOne(() => Task, (task) => task.sessions)
  @JoinColumn({ name: 'task_id', referencedColumnName: 'id' })
  task: Task;

  @Column()
  status_id: number;

  @ManyToOne(() => Status)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: Status;

  @Column()
  member_id: number;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: Member;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: false })
  billable: boolean;
}
