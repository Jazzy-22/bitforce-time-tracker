import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PermissionType {
  VIEW_USERS = 'view_users',
  OBJECT_USER_VIEW = 'object_user_view',
  OBJECT_USER_DELETE = 'object_user_delete',
  OBJECT_USER_CREATE = 'object_user_create',
  OBJECT_USER_EDIT = 'object_user_edit',
  VIEW_PROFILES = 'view_profiles',
  OBJECT_PROFILE_VIEW = 'object_profile_view',
  OBJECT_PROFILE_DELETE = 'object_profile_delete',
  OBJECT_PROFILE_CREATE = 'object_profile_create',
  OBJECT_PROFILE_EDIT = 'object_profile_edit',
  VIEW_ROLES = 'view_roles',
  OBJECT_ROLE_VIEW = 'object_role_view',
  OBJECT_ROLE_DELETE = 'object_role_delete',
  OBJECT_ROLE_CREATE = 'object_role_create',
  OBJECT_ROLE_EDIT = 'object_role_edit',
  VIEW_TEAMS = 'view_teams',
  OBJECT_TEAM_VIEW = 'object_team_view',
  OBJECT_TEAM_DELETE = 'object_team_delete',
  OBJECT_TEAM_CREATE = 'object_team_create',
  OBJECT_TEAM_EDIT = 'object_team_edit',
  OBJECT_ACCOUNT_VIEW = 'object_account_view',
  OBJECT_ACCOUNT_CREATE = 'object_account_create',
  OBJECT_ACCOUNT_EDIT = 'object_account_edit',
  OBJECT_ACCOUNT_DELETE = 'object_account_delete',
  VIEW_TIME_TRACKER = 'view_time_tracker',
  OBJECT_TASK_VIEW = 'object_task_view',
  OBJECT_TASK_CREATE = 'object_task_create',
  OBJECT_TASK_EDIT = 'object_task_edit',
  OBJECT_TASK_DELETE = 'object_task_delete',
  OBJECT_SESSION_CREATE = 'object_session_create',
  VIEW_PROJECTS = 'view_projects',
  OBJECT_PROJECT_VIEW = 'object_project_view',
  OBJECT_PROJECT_VIEW_ALL = 'object_project_view_all',
  OBJECT_PROJECT_CREATE = 'object_project_create',
  OBJECT_PROJECT_EDIT = 'object_project_edit',
  OBJECT_PROJECT_EDIT_ALL = 'object_project_edit_all',
  OBJECT_PROJECT_DELETE = 'object_project_delete',
  OBJECT_PROJECT_EDIT_MEMBERS = 'object_project_edit_members',
  OBJECT_MEMBER_VIEW = 'object_member_view',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'enum',
    enum: PermissionType,
    enumName: 'permission_type',
  })
  label: string;
}
