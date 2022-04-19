import { TestBed } from '@angular/core/testing';

import { FloattingNotificationsService } from './floatting-notifications.service';

describe('FloattingNotificationsService', () => {
  let service: FloattingNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloattingNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
