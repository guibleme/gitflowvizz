import {Injectable} from '@angular/core';
import {CommitService} from './commit.service';
import {CommitDataModel, CommitStatusTypeEnum} from "../models/commit-data.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private commitService: CommitService) { }

  /**
   * Gets the total number of commits
   */
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

  /**
   * Gets the total commit pass rate
   */
  public getTotalPass(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          let result: number[] = [];
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
          commitIds.forEach((singleCommit) => {
            if (commits.filter((commit: CommitDataModel) => commit.commit_id === singleCommit && commit.status === 'failed').length === 0) {
              result.push(singleCommit);
            }
          })
          ob.next(result.length);
          ob.complete();
        });
    });
  }

  /**
   * Gets the total pass rate
   */
  public getTotalPassRate(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          let success: number[] = [];
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
          commitIds.forEach((singleCommit) => {
            if (commits.filter((commit: CommitDataModel) => commit.commit_id === singleCommit && commit.status === 'failed').length === 0) {
              success.push(singleCommit);
            }
          })
          let result2 = success.length/commitIds.length * 100;

          ob.next(parseFloat(result2.toFixed(2)));
          ob.complete();
        });
    });
  }

  /**
   * Gets the enhanced and proccessed stats for commits, to be used with the gannt chart
   */
  public getCommitsEnhancedStats(): Observable<any> {
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

  /**
   * Gets the average commit duration
   */
  public getAverageCommitDuration(): Observable<any> {
    return new Observable((ob) => {
      this.commitService.getAllCommits()
        .subscribe((commits) => {
          let commitStatistics: number[] = [];
          const commitIds = [... new Set(commits.map(commit => commit.commit_id))];
          commitIds.forEach((commitId) => {
            let filteredCommits = commits
              .filter((commit: CommitDataModel) => commit.commit_id === commitId)
            let commitLifeTime = this.calculateTimeDifference(filteredCommits[0].start, filteredCommits[filteredCommits.length - 1].end);
            commitStatistics.push(
              parseInt(commitLifeTime.toFixed(2)))
          })
          let result = commitStatistics.reduce((a, b) => a + b, 0)/commitStatistics.length;
          ob.next(result.toFixed(2));
          ob.complete();
        });
    });
  }

  /**
   * Gets the overall commit stats to build the gantt chart
   */
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

  /**
   * Calculates the difference in minutes between 2 dates
   * @param d1
   * @param d2
   */
  public calculateTimeDifference(d1: any, d2: any): number{
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    let duration = date2.valueOf() - date1.valueOf();
    return duration / (1000*60) % 60;
  }
}
