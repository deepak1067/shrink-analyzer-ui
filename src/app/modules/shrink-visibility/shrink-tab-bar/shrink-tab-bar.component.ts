import { Component } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';

@Component({
  selector: 'app-shrink-tab-bar',
  templateUrl: './shrink-tab-bar.component.html',
  styleUrls: ['./shrink-tab-bar.component.scss']
})
export class ShrinkTabBarComponent {
  matchOptions: IsActiveMatchOptions = {
    paths: 'exact',
    matrixParams: 'exact',
    queryParams: 'subset',
    fragment: 'ignored'
  };
  shrinkTabs:{id:number , tabName:string , url: string}[] = [
    {id:0, tabName: 'Shrink Events', url: '/dashboard' },
    {id:1, tabName: 'Shrink by Rollup', url: '/dashboard/shrink-by-roll-up' },
    {id:2, tabName: 'Highest Shrink by Sites', url: '/dashboard/highest-shrink-by-site' },
  ];
}
