import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { ServicesConfig } from 'app/services.config';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _baseUrl: string = ServicesConfig.apiUrl;

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
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    /*get(): Observable<User>
    {
        return this._httpClient.get<User>(this.base_url + '/api/usuarios/' + this._user.).pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
        );
    }*/

    /**
     * Update the user
     *
     * @param user
     */
    /*update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('/user/1087960237', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }*/
}
