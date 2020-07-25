import { TestBed } from '@angular/core/testing';

import { TesterServiceService } from './tester-service.service';

describe('TesterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TesterServiceService = TestBed.get(TesterServiceService);
    expect(service).toBeTruthy();
  });
});
