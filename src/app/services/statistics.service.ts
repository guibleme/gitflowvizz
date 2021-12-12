import {Injectable} from '@angular/core';
import {CommitService} from './commit.service';
import {CommitDataModel, CommitStatusTypeEnum} from "../models/commit-data.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private commitService: CommitService) { }

  public getTotalCommits(): Observable<number> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))]
          ob.next(commitIds.length);
          ob.complete();
        });
    });
  }

  public getTotalPass(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          let result: number[] = [];
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
          commitIds.forEach((singleCommit) => {
            if (commits.filter((commit: CommitDataModel) => commit.commit_id === singleCommit && commit.status === CommitStatusTypeEnum.failed).length === 0) {
              result.push(singleCommit);
            }
          })
          ob.next(result.length);
          ob.complete();
        });
    });
  }

  public getTotalPassRate(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          let success: number[] = [];
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
          commitIds.forEach((singleCommit) => {
            if (commits.filter((commit: CommitDataModel) => commit.commit_id === singleCommit && commit.status === CommitStatusTypeEnum.failed).length === 0) {
              success.push(singleCommit);
            }
          })
          let result2 = success.length/commitIds.length * 100;

          ob.next(parseFloat(result2.toFixed(2)));
          ob.complete();
        });
    });
  }

  public getAverageTime(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          this.commitService.getAllCommits()
            .subscribe((commits) => {
              // @ts-ignore
              let commitStatistics = [];
              const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
              commitIds.forEach((commitId) => {
                let filteredCommits = commits
                  .filter((commit: CommitDataModel) => commit.commit_id === commitId)
                  .sort((a,b) =>  new Date(a.start).getTime() - new Date(b.start).getTime())
                let commitFinalStatus = filteredCommits[filteredCommits.length - 1].status;
                let commitFinalEvent = filteredCommits[filteredCommits.length - 1].event;
                let commitLifeTime = this.calculateTimeDifference(filteredCommits[0].start, filteredCommits[filteredCommits.length - 1].end);
                let events: any[] = [];
                filteredCommits.forEach(commitEvent => {
                  events.push({
                    name: commitEvent.event,
                    time: this.calculateTimeDifference(commitEvent.start, commitEvent.end).toFixed(2),
                    status: commitEvent.status,
                    start_time: commitEvent.start,
                    end_time: commitEvent.end
                  })
                })
                commitStatistics.push({
                  commit_id: commitId,
                  final_event: commitFinalEvent,
                  final_status: commitFinalStatus,
                  start_time: filteredCommits[0].start,
                  end_time: filteredCommits[filteredCommits.length - 1].end,
                  commitLifeTime: commitLifeTime.toFixed(2),
                  user: filteredCommits[0].user,
                  events: events.sort((a,b) =>  new Date(a.start).getTime() - new Date(b.start).getTime())
                })
              })
              // @ts-ignore
              ob.next(commitStatistics);
              ob.complete();
            });
        });
    });
  }

  public getCommitStats(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          this.commitService.getAllCommits()
            .subscribe((commits) => {
              // @ts-ignore
              let commitStatistics = [];
              const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
              commitIds.forEach((commitId) => {
                let filteredCommits = commits
                  .filter((commit: CommitDataModel) => commit.commit_id === commitId)
                  .sort((a,b) =>  new Date(a.start).getTime() - new Date(b.start).getTime())
                let commitFinalStatus = filteredCommits[filteredCommits.length - 1].status;
                let commitFinalEvent = filteredCommits[filteredCommits.length - 1].event;
                let commitLifeTime = this.calculateTimeDifference(filteredCommits[0].start, filteredCommits[filteredCommits.length - 1].end);
                let events: any[] = [];
                filteredCommits.forEach(commitEvent => {
                  events.push({
                    name: commitEvent.event,
                    time: this.calculateTimeDifference(commitEvent.start, commitEvent.end).toFixed(2),
                    status: commitEvent.status
                  })
                })
                commitStatistics.push({
                  commit_id: commitId,
                  final_event: commitFinalEvent,
                  final_status: commitFinalStatus,
                  start_time: filteredCommits[0].start,
                  end_time: filteredCommits[filteredCommits.length - 1].end,
                  commitLifeTime: commitLifeTime.toFixed(2),
                  user: filteredCommits[0].user,
                  events: events
                })
              })
              // @ts-ignore
              ob.next(commitStatistics);
              ob.complete();
            });
        });
    });
  }

  public calculateTimeDifference(d1: any, d2: any): number{
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    let duration = date2.valueOf() - date1.valueOf();
    return duration / (1000*60) % 60;
  }
}
