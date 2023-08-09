import {Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {UserPreferencesDialogComponent} from "../user-preferences-dialog/user-preferences-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userInfo: UserInfo = {
    email: '',
    customAttributes: [],
    lastLoginAt: '',
    displayName: ''
  };

  constructor(private authService: AuthService, private dialog: MatDialog) {
  }
  
  ngOnInit(): void {

    this.authService.fetchUserInformation()?.subscribe({
      next: (res) => {
        if (res) {
          this.authService.saveInCookie('uinfo', JSON.stringify(res));
          this.userInfo = JSON.parse(this.authService.getFromCookie('uinfo') ?? '');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
    }
    
  getShortName(fullName : string) {
    const names = fullName.split(' ');
    let initials = names[0][0];
    if (names.length > 1 && names[names.length - 1] !== '') {
      initials += names[names.length - 1][0];
    }
    return initials;
  }

  logout() {
    this.authService.logout();
  }

  openUserPreferences() {
    const dialogRef = this.dialog.open(UserPreferencesDialogComponent, {
      width: '35%',
      minHeight: '65%',
      maxHeight: '75%',
      data:{
        displayName: this.userInfo.displayName,
      },
    });
  }
}
export interface UserInfo{
    email: string,
    customAttributes:string [],
    lastLoginAt: string,
    displayName: string
}
