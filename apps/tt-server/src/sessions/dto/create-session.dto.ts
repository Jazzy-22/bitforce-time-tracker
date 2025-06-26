export class CreateSessionDto {
  user_id?: number;
  task_id: number;
  status_id?: number;
  member_id?: number;
  project_id?: number;
  start_date: Date;
  end_date: Date;
  billable: boolean;
}
