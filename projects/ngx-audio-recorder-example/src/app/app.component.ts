import { Component, OnInit } from '@angular/core';
import { NgxAudioRecorderService, OutputFormat } from 'ngx-audio-recorder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  // all available recording devices
  devices!: MediaDeviceInfo[];

  // choosed mic to use
  micToUse!: string;

  recordedAudio: any;


  constructor(private ngxAudioRecorder: NgxAudioRecorderService) { }

  ngOnInit(): void {
    this.getDevices();
  }

  // get all available recording devices
  async getDevices(): Promise<void> {
    const devices = await this.ngxAudioRecorder.getAvailableRecordingDevices();
    this.devices = devices;
    this.micToUse = devices[0]?.deviceId;
  }

  // start recording audio
  startRecording(): void {
    this.ngxAudioRecorder.startRecording();
  }

  // stop recording && get recorded file
  async stopRecording(): Promise<void> {
    try {
      this.recordedAudio = await this.ngxAudioRecorder.stopRecording(OutputFormat.WEBM_BLOB_URL);
    } catch (err) {
      console.log(err)
    }
  }


  // set mic to record
  setMic(): void {
    this.ngxAudioRecorder.setMic(this.micToUse);
  }
}
