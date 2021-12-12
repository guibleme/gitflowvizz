export interface CommitDataModel {
  event: CommitEventTypeEnum;
  user: string;
  commit_id: number;
  status: CommitStatusTypeEnum;
  start: Date;
  end: Date;
  reviewer?: string[];
}

export enum CommitEventTypeEnum {
  pull = 'pull',
  patch = 'patch',
  build = 'build',
  sanity = 'sanity',
  review = 'review',
  merge = 'merge'
}

export enum CommitStatusTypeEnum {
  success = 'success',
  failed = 'failed',
  approved = 'approved'
}
