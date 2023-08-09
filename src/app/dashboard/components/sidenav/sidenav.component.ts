import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isMenuOpen = true;
  arrowIcon: string='keyboard_double_arrow_left';
  contentMargin = 240;
  previousUrl : string = '/dashboard';
  menuItems = [
    {
      path: '/dashboard',
      icon: 'SV',
      label: 'Shrink Visibility'
    },
    {
      path: '/dashboard/bulk-shrink-events',
      icon: 'BS',
      label: 'Bulk Shrink',
    },
    {
      path: '/dashboard/rfid-exit-read',
      icon: 'RR',
      label: 'RFID Exit Read',
    },
    {
      path: '/dashboard/epc-read-list',
      icon: 'ER',
      label: 'EPC Read List',
    },
    {
      path: '/dashboard/management-performance',
      icon: 'MP',
      label: 'Management Performance',
    },
  ];

  constructor(private router:Router){
  }

  ngOnInit(){
    this.router.events
    .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
    .subscribe((events: RoutesRecognized[]) => {
      this.previousUrl = events[0].urlAfterRedirects;
    });
  }

  checkRouteActive(url: string):boolean{
    let routerUrl = this.router.url;
    if(routerUrl.includes('?')){
      routerUrl = this.router.url.substring(0,routerUrl.indexOf('?'));
    }
    if(this.previousUrl.includes('?')){
      this.previousUrl = this.previousUrl.substring(0,this.previousUrl.indexOf('?'));
    }
    if(url === routerUrl){
      return true;
    }
    if(url === '/dashboard' && routerUrl.includes('/dashboard/highest-shrink-by-site')){
      return true;
    }
    if(url === '/dashboard' && routerUrl.includes('/dashboard/shrink-by-roll-up')){
      return true;
    }
    if(this.router.url === '/dashboard/api-error' && this.previousUrl!== undefined){
      if(this.previousUrl === url){
        return true;
      }
    }
    return false;
  }

  onToolbarMenuToggle() {
    this.isMenuOpen = !this.isMenuOpen;
    this.arrowIcon = !this.isMenuOpen ?'keyboard_double_arrow_right':'keyboard_double_arrow_left'
    if(!this.isMenuOpen) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 240;
    }
  }
}
