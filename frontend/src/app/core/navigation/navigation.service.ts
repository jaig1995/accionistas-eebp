import { HttpClient } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import {Observable, ReplaySubject, Subject, takeUntil, tap} from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import {User} from "../user/user.types";

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private base_url = 'http://localhost:8081'
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
        return this._httpClient.get<Navigation>(this.base_url + '/api/seguridad/perfiles/navigation/' + this.user.id).pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }
}
