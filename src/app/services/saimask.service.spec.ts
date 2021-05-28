import { TestBed } from '@angular/core/testing';

import { SaimaskService } from './saimask.service';

describe('SaimaskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaimaskService = TestBed.get(SaimaskService);
    expect(service).toBeTruthy();
  });
});
