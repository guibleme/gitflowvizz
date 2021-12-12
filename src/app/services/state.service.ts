import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public currentlySelectedUser: string = '';
  public currentlySelectedCommit: string = '';

  constructor() { }

}
