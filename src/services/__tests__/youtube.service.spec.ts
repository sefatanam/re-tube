import { TestBed } from '@angular/core/testing';

import { YoutubeService } from '../youtube.service';

describe('YoutubeService', () => {
  let service: YoutubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeService);
  });
});
