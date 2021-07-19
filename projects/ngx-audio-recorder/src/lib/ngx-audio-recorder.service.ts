import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare var MediaRecorder: any;


@Injectable()
export class NgxAudioRecorderService {

  private chunks: Array<any> = [];

  protected recorderEnded = new EventEmitter();
  public recorderError = new EventEmitter<ErrorCase>();

  private recorderState = RecorderState.INITIALIZING;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private domSanitizer: DomSanitizer) {
  }

  private recorder: any;


  /**
   * @param deviceId? "optional" {MediaTrackConstraints | boolean}
   * @returns {Promise<MediaStream>}
   */
  getUserContent(deviceId?: string | boolean): Promise<MediaStream> | any {

    // record options
    let options: any;

    // set recorde device if user choose other device
    if (deviceId && typeof deviceId === 'string') {
      options = { deviceId }
    } else {
      options = true;
    }


    // to work with ssr
    if (isPlatformBrowser(this.platformId)) {
      return navigator.mediaDevices.getUserMedia({ audio: options });
    }
  }

  /**
   * @description stert recording
   * @returns void
   */
  startRecording(): void {
    if (this.recorderState === RecorderState.RECORDING) {
      this.recorderError.emit(ErrorCase.ALREADY_RECORDING);
    }
    if (this.recorderState === RecorderState.PAUSED) {
      this.resume();
      return;
    }
    this.recorderState = RecorderState.INITIALIZING;
    this.getUserContent().then((mediaStream: MediaStream) => {
      this.recorder = new MediaRecorder(mediaStream);
      this.recorderState = RecorderState.INITIALIZED;
      this.addListeners();
      this.recorder.start();
      this.recorderState = RecorderState.RECORDING;
    });
  }

  pause(): void {
    if (this.recorderState === RecorderState.RECORDING) {
      this.recorder.pause();
      this.recorderState = RecorderState.PAUSED;
    }
  }

  resume(): void {
    if (this.recorderState === RecorderState.PAUSED) {
      this.recorderState = RecorderState.RECORDING;
      this.recorder.resume();
    }
  }

  /**
   * @description stop recording and get recorded file
   * @param outputFormat WEBM_BLOB_URL || WEBM_BLOB
   * @returns Promise<Blob | audioURL>
   */
  stopRecording(outputFormat: OutputFormat): Promise<any> {
    this.recorderState = RecorderState.STOPPING;
    return new Promise((resolve, reject) => {
      this.recorderEnded.subscribe((blob) => {
        this.recorderState = RecorderState.STOPPED;
        if (outputFormat === OutputFormat.WEBM_BLOB) {
          resolve(blob);
        }
        if (outputFormat === OutputFormat.WEBM_BLOB_URL) {
          const audioURL = URL.createObjectURL(blob);
          const safeAudioURL = this.domSanitizer.bypassSecurityTrustUrl(audioURL);
          resolve(safeAudioURL);
        }
      }, _ => {
        this.recorderError.emit(ErrorCase.RECORDER_TIMEOUT);
        reject(ErrorCase.RECORDER_TIMEOUT);
      });
      this.recorder.stop();
    }).catch(() => {
      this.recorderError.emit(ErrorCase.USER_CONSENT_FAILED);
    });
  }

  /**
   * @description get recorder state
   * @returns {RecorderState}
   */
  getRecorderState(): RecorderState {
    return this.recorderState;
  }

  private addListeners(): void {
    this.recorder.ondataavailable = this.appendToChunks;
    this.recorder.onstop = this.recordingStopped;
  }

  // handle append data to chunk
  private appendToChunks = (event: any): void => {
    this.chunks.push(event.data);
  };

  // handle record stop
  private recordingStopped = (event: any) => {
    const blob = new Blob(this.chunks, { type: 'audio/webm' });
    this.chunks = [];
    this.recorderEnded.emit(blob);
    this.clear();
  };

  private clear(): void {
    this.recorder = null;
    this.chunks = [];
  }


  /**
   * @description set mic to use in recording
   * @param micId {string}
   */
  setMic(micId: string): void {
    this.getUserContent(micId);
  }

  /**
   * @description get all available recorde devices
   * @returns {Promise<MediaDeviceInfo[]}
   */
  async getAvailableRecordingDevices(): Promise<MediaDeviceInfo[] | any> {

    if (isPlatformBrowser(this.platformId)) {
      return (await navigator.mediaDevices.enumerateDevices())
        .filter((d) => d.kind === 'audioinput')
    }

  }
}


export enum OutputFormat {
  WEBM_BLOB_URL,
  WEBM_BLOB,
}

export enum ErrorCase {
  USER_CONSENT_FAILED,
  RECORDER_TIMEOUT,
  ALREADY_RECORDING
}

export enum RecorderState {
  INITIALIZING,
  INITIALIZED,
  RECORDING,
  PAUSED,
  STOPPING,
  STOPPED
}