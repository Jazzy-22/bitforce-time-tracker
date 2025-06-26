import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Role } from 'src/roles/entities/role.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_id: number;

  @Column()
  project_id: number;

  @Column()
  role_id: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;
}
