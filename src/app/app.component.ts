import {Component} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {DataDogService} from "./shared/services/datadog.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shrink-analyzer-ui';
  loading = false;
  googleMapKey = environment.googleMapKey;

  constructor(private router: Router, private dataDogService: DataDogService) {
    this.loadGoogleMap();
    this.router.events.subscribe((e: Event) => {
      this.navigationInterceptor(e);
    });
    this.dataDogService.initializeDataDog();
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }

  loadGoogleMap() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapKey}&callback=Function.prototype`;
    document.head.append(script);
  }
}
