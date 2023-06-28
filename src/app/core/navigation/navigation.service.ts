import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private base_url = 'http://localhost:3000'

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
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
        return this._httpClient.get<Navigation>(this.base_url + '/navigation/1087960237').pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }
}
