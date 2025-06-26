import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';

@Entity()
@Tree('closure-table', {
  closureTableName: 'role_hierarchy',
  ancestorColumnName: (column) => 'parent_role_' + column.propertyName,
  descendantColumnName: (column) => 'child_role_' + column.propertyName,
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  parent_id: number;

  @TreeChildren()
  children: Role[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: Role;

  @TreeLevelColumn()
  @Column({ default: 2 })
  level: number;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
