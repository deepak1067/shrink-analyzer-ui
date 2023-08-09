import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user-preferences-dialog',
  templateUrl: './user-preferences-dialog.component.html',
  styleUrls: ['./user-preferences-dialog.component.scss']
})
export class UserPreferencesDialogComponent {

  supportedLanguages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
  ];
  displayName! : string;
  selectedLanguage! : string;

  constructor(private dialogRef : MatDialogRef<UserPreferencesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private  translate : TranslateService) {
    this.displayName = data.displayName;
    this.selectedLanguage = localStorage.getItem('selectedLanguage') ?? this.translate.currentLang ?? this.supportedLanguages[0].value;
  }

  onApply(language: string) {
    this.selectedLanguage = language;
    this.translate.use(language);
  }

  onSave() {
    localStorage.setItem('selectedLanguage', this.selectedLanguage);
    this.dialogRef.close();
  }

}
