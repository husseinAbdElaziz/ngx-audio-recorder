# NgxAudioRecorder

Audio Recorder Service for Angular2+ Applications

**Features**

- Uses Media Recorder API
- Supports pause & resume & change record device
- work with SSR
- **1KB** minified and gzipped
- Exports as WEBM audio Blob or WEBM audio blob URL

## Installation

To add the Audio recorder to your Angular project:

```
npm i ngx-audio-recorder
```

Once installed, add the Progressive Loader to your `app.module.ts`:

```typescript
import { NgxAudioRecorderModule } from 'ngx-audio-recorder';

...

@NgModule({
   ...
   imports: [
     ...
     NgxAudioRecorderModule,
    ...
   ],
   ...
});
export class AppModule {}
```

## Sample usage

```typescript
import { NgxAudioRecorderService, OutputFormat } from 'ngx-audio-recorder';
...

@Component({...})
export class AppComponent {

    devices: MediaDeviceInfo[];

    constructor(private audioRecorderService: NgxAudioRecorderService) {

        this.audioRecorderService.recorderError.subscribe(recorderErrorCase => {
            // Handle Error
        })
    }

    startRecording() {
        this.audioRecorderService.startRecording();
    }

    async stopRecording() {
        try {
            // do post output steps
            const output = await this.audioRecorderService.stopRecording(outputFormat);

        } catch(errrorCase) {
            // Handle Error
        }
    }

}
```

## Output Formats

| Name                           | Description                          |
| ------------------------------ | ------------------------------------ |
| **OutputFormat.WEBM_BLOB**     | Webm Blob for the recorded audio     |
| **OutputFormat.WEBM_BLOB_URL** | Webm Blob URL for the recorded audio |

## Error Cases

| Name                              | Description                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| **ErrorCase.USER_CONSENT_FAILED** | If user denies audio access or if the website is accessed on http instead of https |
| **ErrorCase.ALREADY_RECORDING**   | If you call start recording and state is RECORDING                                 |

## Audio Recorder State

| Name                           | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| **RecorderState.INITIALIZING** | State before calling mediarecorder record API and user consent |
| **RecorderState.INITIALIZED**  | On user consent successful                                     |
| **RecorderState.RECORDING**    | When Recording is in progress                                  |
| **RecorderState.PAUSED**       | On pausing the recording                                       |
| **RecorderState.STOPPING**     | After calling stopped and before promise return                |
| **RecorderState.STOPPED**      | On successful stop of media recorder                           |

## Methods

| Name                             | Input Type     | Return Type                  | Description                                                                             |
| -------------------------------- | -------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| **startRecording**               | -              | -                            | Gets the consent and starts recording or resumes if paused                              |
| **stopRecording**                | `OutputFormat` | `Promise`                    | If successful, output will be desired output, if rejected, `ErrorCase` will be returned |
| **getRecorderState**             | -              | `RecorderState`              | Returns the current state of recorder                                                   |
| **pause**                        | -              | -                            | Pauses the current recording                                                            |
| **resume**                       | -              | -                            | Resumes the paused recording                                                            |
| **getUserContent**               | -              | `Promise`                    | Resolves if user allows, rejects if link is not secure or user rejects                  |
| **setMic**                       | `deviceId`     | `void`                       | set mic to record                                                                       |
| **getAvailableRecordingDevices** | -              | `Promise<MediaDeviceInfo[]>` | get all Available Recording Devices                                                     |

## Events

| Event             | OutputData | Description                  |
| ----------------- | ---------- | ---------------------------- |
| **recorderError** | ErrorCase  | Emits Event in case of error |
