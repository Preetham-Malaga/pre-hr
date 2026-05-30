export interface Holiday {
  id: string;

  holiday_name: string;

  holiday_date: string;

  holiday_type: string;

  description: string | null;

  created_at: string;
}

export interface HolidayFormData {
  holiday_name: string;

  holiday_date: string;

  holiday_type: string;

  description?: string;
}