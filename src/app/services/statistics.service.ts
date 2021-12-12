import {Injectable} from '@angular/core';
import {CommitService} from './commit.service';
import {CommitDataModel, CommitStatusTypeEnum} from "../models/commit-data.model";
import {filter} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private commitService: CommitService) { }

  public getTotalCommits(): number {
    return this.commitService.getAllCommits().length;
  }

  public getTotalPass(): number {
    let commits =  this.commitService.getAllCommits();
    return commits.filter((commit: CommitDataModel) => commit.status === CommitStatusTypeEnum.success).length;
  }

  public getTotalPassRate(): number {
    let commits =  this.commitService.getAllCommits();
    const success = commits.filter((commit: CommitDataModel) => commit.status === CommitStatusTypeEnum.success).length;
    let result = success/commits.length * 100;
    return parseFloat(result.toFixed(2));
  }

  public getAverageTime() {
    let commits =  this.commitService.getAllCommits();
    // @ts-ignore
    let commitStatistics = [];
    const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
    commitIds.forEach((commitId) => {
      let filteredCommits = commits
        .filter((commit: CommitDataModel) => commit.commit_id === commitId)
        .sort((a,b) =>  new Date(a.start).getTime() - new Date(b.start).getTime())
      let commitLifeTime = this.calculateTimeDifference(filteredCommits[0].start, filteredCommits[filteredCommits.length - 1].end);
      let commitFinalStatus = filteredCommits[filteredCommits.length - 1].status;
      let commitFinalEvent = filteredCommits[filteredCommits.length - 1].status;
      commitStatistics.push({
        commit_id: commitId,
        final_event: commitFinalEvent,
        final_status: commitFinalStatus,
        start_time: filteredCommits[0].start,
        end_time: filteredCommits[filteredCommits.length - 1].end,
        commitLifeTime: commitLifeTime
      })
    })

    // @ts-ignore
    return commitStatistics;
  }

  public calculateTimeDifference(d1: any, d2: any): number{
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    let duration = date2.valueOf() - date1.valueOf();
    return duration / (1000*60*60) % 24;
  }
}
