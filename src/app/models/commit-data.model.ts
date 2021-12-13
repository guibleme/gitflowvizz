export interface CommitDataModel {
  event: CommitEventTypeEnum;
  user: string;
  commit_id: number;
  status: string;
  start: Date;
  end: Date;
  reviewer?: string[];
}

export enum CommitEventTypeEnum {
  pull = 0,
  patch = 1,
  build = 2,
  sanity = 3,
  review = 4,
  merge = 5
}

export enum CommitStatusTypeEnum {
  failed = 0 ,
  success = 1 ,
  approved = 2
}
