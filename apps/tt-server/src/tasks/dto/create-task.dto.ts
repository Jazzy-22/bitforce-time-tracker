export class CreateTaskDto {
  project_id: number;
  status_id: number;
  sprint_id: number;
  title: string;
  start_date: Date;
  due_date: Date;
  end_date: Date;
  points: number;
  estimated_hours: number;
  accrued_hours: number;
  billable: boolean;
  billable_hours: number;
  role_id: number;
}
