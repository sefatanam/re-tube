import { TestBed } from '@angular/core/testing';

import { DOMService } from './dom.service';

describe('DOMService', () => {
  let service: DOMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DOMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
