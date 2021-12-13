# Gitflowviz

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.1.

## The challenge
This is a project to address a code challenge.
The rules for the challenge are as follows:

### Objectives

- Create a commit workflow application based on Angular 8 or above.
- A Commit Workflow Comprise of following phases:
  - Commit Pull 
  - Commit Patch 
  - Commit Build 
  - Commit Sanity 
  - Commit Review 
  - Commit Merge 
- A single page application to report following for the selected user from the drop down:
  - A summary stating total commits, total pass, pass rate, average time for each commit. 
  - A Gantt chart view show casing the timeline for each commit, the commit entity in the Gantt chart should be colored coded based on success or failure. 
    - In case of commit success: Timeline will be based on start of the first event that is pull and last event that is merge. 
    - In case of commit failure: Timeline will be based on first event and any last event present.
    
### Main features

- Main page, with the overall status and view all commits in a timeline
- Dropdown to select a user from a list of users in a Dashboard page with summary of
  - total commits
  - total passes
  - pass rate
  - average time for each commit.
- A Gantt chart view show casing the timeline for each commit
- The commit entity in the Gantt chart should be colored coded based on success or failure.
- **Bonus**: A separate gantt chart to select the commit to then view a breakdown of each commit phase
- **Bonus**: A stacked bar chart showing the contributions of each phase towards the overall commmit time, 1 bar per commit


### Observations
- As a matter of practicality, the data has been statically imported into the project. However, the data handling controllers/services utilize **RxJs** methods to apply proper communication syntax.
- You can find the running project on https://gitflowvizz.vercel.app/
- The repo for this project is https://github.com/guibleme/gitflowvizz
