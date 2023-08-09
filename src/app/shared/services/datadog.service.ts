import { Injectable } from '@angular/core';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs, LogsEvent, StatusType } from '@datadog/browser-logs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataDogService {
  private datadogEnv = environment.dataDogEnv;

  constructor() {
  }

  log(componentName: string, message: string, data?: any) {
    const stackTrace = new Error().stack;
    const stackLines = stackTrace ? stackTrace.split('\n') : [];

    if (stackLines.length >= 4) {
      const callerLine = stackLines[3];
      const matches = /at (.+) \(/.exec(callerLine);
      if (matches && matches.length > 1) {
        const methodName = matches[1];
        // datadogLogs.logger.info(`${componentName} :: ${message}`, data);
        console.log(`${componentName} :: ${message}`, data);
      } else {
        // datadogLogs.logger.info(`${componentName} - ${message}`, data);
        console.log(`${componentName} - ${message}`, data);
      }
    } else {
      // datadogLogs.logger.info(`${componentName} - ${message}`, data);
      console.log(`${componentName} - ${message}`, data);
    }
  }

  initializeDataDog() {
    if (this.datadogEnv !== 'LOCAL') {
      datadogRum.init({
        applicationId: '4587fc2d-fe31-4bbe-b248-343976bc32d1',
        clientToken: 'pub642ad443da2be7d89378084029348ff1',
        site: 'datadoghq.com',
        service: 'shrink--analyzer',
        env: this.datadogEnv,
        // allowedTracingOrigins: ["https://smaas.sensormatic.com/", "https://uat-smaas.sensormatic.com/",
        //   /https:\/\/\smaas.sensormatic\.com/,/https:\/\/\uat-smaas.sensormatic\.com/],
        //  version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: 'mask-user-input'
      });

      datadogRum.startSessionReplayRecording();

      // Logs configuration
      datadogLogs.init({
        clientToken: 'pub642ad443da2be7d89378084029348ff1',
        site: 'datadoghq.com',
        service: 'shrink--analyzer',
        env: 'LOCAL',
        forwardErrorsToLogs: true,
        sessionSampleRate: 100,
        beforeSend: (event: LogsEvent) => {
          // Remove email from view URL
          event.view.url = event.view.url.replace(/email=[^&]*/, 'email=REDACTED');
          return true;
        },
      });

      // Send logs to the console and Datadog (http)
      datadogLogs.logger.setHandler(['http', 'console']);
      datadogLogs.logger.setLevel(StatusType.debug);
      datadogLogs.logger.info('datadog configured for the environment');
      datadogLogs.logger.info('------------i-------------------Button clicked', {name: 'buttonName', id: 123});
      datadogLogs.logger.debug('-----------d--------------------Button clicked', {name: 'buttonName', id: 123});
    } else {
      console.log('datadog not configured for the environment');
    }
  }
}
