import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { contacts as contactsData, countries as countriesData, tags as tagsData } from 'app/mock-api/apps/contacts/data';
import { assign, cloneDeep } from 'lodash-es';
import { from, map } from 'rxjs';
import { DataPrueba } from './data';

@Injectable({providedIn: 'root'})
export class CreateTemplateMockApi
{
    private _data: any[] = DataPrueba;


    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void{

        this._fuseMockApiService
            .onGet('api/pruebas',250)
            .reply(() => {
                const contacts = cloneDeep(this._data);
                return [200, contacts];
            })
    }
}
