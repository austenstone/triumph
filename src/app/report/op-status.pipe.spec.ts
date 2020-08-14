import { OpStatusPipe, OpStatusPipe2 } from './op-status.pipe';

describe('OpStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new OpStatusPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('OpStatusPipe2', () => {
  it('create an instance', () => {
    const pipe = new OpStatusPipe2();
    expect(pipe).toBeTruthy();
  });
});
