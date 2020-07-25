import { TestBed } from '@angular/core/testing';

import { ManagerServiceService } from './manager-service.service';

describe('ManagerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagerServiceService = TestBed.get(ManagerServiceService);
    expect(service).toBeTruthy();
  });
});
