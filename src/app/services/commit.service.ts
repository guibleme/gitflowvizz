import {CommitDataModel} from '../models/commit-data.model';
import {Injectable} from '@angular/core';
import {commits} from '../data';
import {Observable, of} from "rxjs";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class CommitService {

  constructor(private stateService: StateService) { }

  public getAllCommits(): Observable<CommitDataModel[]> {
    let result;
    if (this.stateService.currentlySelectedUser) {
      result = commits.filter((commit: CommitDataModel) => commit.user === this.stateService.currentlySelectedUser) as CommitDataModel[];
    } else {
      result = commits as CommitDataModel[];
    }
    return of(result);
  }

  public getAllUsers(): Observable<string[]> {
    return of([... new Set(commits.map((commit: CommitDataModel) => commit.user))]);
  }
}
