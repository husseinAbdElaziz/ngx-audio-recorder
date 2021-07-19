import { TestBed } from '@angular/core/testing';

import { NgxAudioRecorderService } from './ngx-audio-recorder.service';

describe('NgxAudioRecorderService', () => {
  let service: NgxAudioRecorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAudioRecorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
