import { HttpClient } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import {Observable, ReplaySubject, Subject, takeUntil, tap} from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import {User} from "../user/user.types";
import { ServicesConfig } from 'app/services.config';


@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _baseUrl: string = ServicesConfig.apiUrl;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _userService: UserService)
    {
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) =>
            {
                this.user = user;
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>(this._baseUrl + '/api/seguridad/perfiles/navigation/' + this.user.id).pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }
}
