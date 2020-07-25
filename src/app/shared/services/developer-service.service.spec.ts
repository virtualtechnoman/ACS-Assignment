import { TestBed } from '@angular/core/testing';

import { DeveloperServiceService } from './developer-service.service';

describe('DeveloperServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeveloperServiceService = TestBed.get(DeveloperServiceService);
    expect(service).toBeTruthy();
  });
});
