export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  job_id: string | null;
  status: CandidateStatus;
  source: string | null;
  experience_years: number;
  current_company: string | null;
  current_designation: string | null;
  expected_salary: number | null;
  notice_period_days: number;
  resume_url: string | null;
  resume_file_name: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  notes: string | null;
  rating: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // joined
}

export interface CandidateFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_id: string;
  status: CandidateStatus;
  source: string;
  experience_years: number;
  current_company: string;
  current_designation: string;
  expected_salary: string;
  notice_period_days: number;
  linkedin_url: string;
  portfolio_url: string;
  notes: string;
  rating: number | null;
}

export interface CandidateFilters {
  search: string;
  status: CandidateStatus | '';
  job_id: string;
  page: number;
  pageSize: number;
}

export const CANDIDATE_STATUS_CONFIG: Record<
  CandidateStatus,
  { label: string; color: string; bg: string }
> = {
  new:        { label: 'New',        color: 'text-blue-700',   bg: 'bg-blue-50'   },
  screening:  { label: 'Screening',  color: 'text-yellow-700', bg: 'bg-yellow-50' },
  interview:  { label: 'Interview',  color: 'text-purple-700', bg: 'bg-purple-50' },
  offer:      { label: 'Offer',      color: 'text-orange-700', bg: 'bg-orange-50' },
  hired:      { label: 'Hired',      color: 'text-green-700',  bg: 'bg-green-50'  },
  rejected:   { label: 'Rejected',   color: 'text-red-700',    bg: 'bg-red-50'    },
  withdrawn:  { label: 'Withdrawn',  color: 'text-gray-700',   bg: 'bg-gray-100'  },
};

export const CANDIDATE_PIPELINE_ORDER: CandidateStatus[] = [
  'new', 'screening', 'interview', 'offer', 'hired',
];