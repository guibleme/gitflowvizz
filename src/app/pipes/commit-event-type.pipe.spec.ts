import { CommitEventTypePipe } from './commit-event-type.pipe';

describe('CommitEventTypePipe', () => {
  it('create an instance', () => {
    const pipe = new CommitEventTypePipe();
    expect(pipe).toBeTruthy();
  });
});
