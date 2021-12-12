import {CommitDataModel} from '../models/commit-data.model';
import {Injectable} from '@angular/core';
import {commits} from '../data';

@Injectable({
  providedIn: 'root'
})
export class CommitService {

  constructor() { }

  public getAllCommits(): CommitDataModel[] {
    return commits as CommitDataModel[];
  }

  public getAllUsers(): string[] {
    return [... new Set(commits.map((commit: CommitDataModel) => commit.user))];
  }
}
