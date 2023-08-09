import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from 'src/app/core/services/auth.service';
import {Subscription} from "rxjs";
import {DataDogService} from "../../../../shared/services/datadog.service";

@Component({
    selector: 'app-auth-process',
    templateUrl: './auth-process.component.html',
    styleUrls: ['./auth-process.component.scss']
})
export class AuthProcessComponent implements OnInit, OnDestroy {

    UUID: string = "";
    userId: string = "";
    tenantId: string = "";
    private subscription!: Subscription;
    private fetchSubscription!: Subscription;


    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private dataDogService:DataDogService) {
    }

    ngOnInit(): void {
        this.subscription = this.route.params.subscribe((params) => {
            this.UUID = params['uuid'];
            this.userId = params['userid'];
            this.tenantId = params['tenantId'];
            // save tenant in cookie
            this.authService.saveTenantIdInCookie(this.tenantId);
            if (this.UUID) {
                this.fetchSubscription = this.authService.fetchTokenFromSSOServer(this.UUID)
                    .subscribe({
                        next: (res) => {
                            if (res.idToken) {
                                this.authService.saveTokenInCookie(res.idToken);
                                this.authService.saveTenantDetailsInCookie();
                            }
                        },
                        error: (err) => {
                            // Handle the error
                            this.router.navigateByUrl("/");
                        }
                    });
            }
        });
        // this.dataDogService.log(this.constructor.name,"Token ID", this.tenantId )
        // this.dataDogService.log(this.constructor.name,"User ID", this.userId )
        // this.dataDogService.log(this.constructor.name,"UUID", this.UUID )
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.fetchSubscription) {
            this.fetchSubscription.unsubscribe();
        }
    }
}
