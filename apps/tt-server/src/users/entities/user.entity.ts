import { Profile } from 'src/profiles/entities/profile.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Member } from 'src/members/entities/member.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  OneToMany,
} from 'typeorm';

@Entity()
@Tree('closure-table', {
  closureTableName: 'user_hierarchy',
  ancestorColumnName: (column) => 'manager_' + column.propertyName,
  descendantColumnName: (column) => 'direct_report_' + column.propertyName,
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profile_id: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  profile: Profile;

  @Column()
  role_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @TreeChildren()
  direct_reports: User[];

  @TreeParent()
  @JoinColumn({ name: 'manager_id', referencedColumnName: 'id' })
  manager: User;

  @Column({ nullable: true })
  manager_id: number;

  @TreeLevelColumn()
  @Column({ default: 2 })
  level: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true, update: false })
  email: string;

  @Column({ nullable: true })
  landline: number;

  @Column({ nullable: true })
  mobile: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  password_last_changed: Date;

  @Column()
  active: boolean;

  @Column({ default: false })
  blocked: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ default: 0 })
  failed_attempts: number;

  @Column({ nullable: true })
  img_url: string;

  @Column({ nullable: true })
  pw_reset_date: Date;

  @Column({ nullable: true })
  recovery_token: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];
}
