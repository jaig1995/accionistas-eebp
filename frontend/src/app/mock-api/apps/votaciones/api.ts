import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { pruebas } from './data';

@Injectable({ providedIn: 'root' })
export class VotacionesMockApi {
    private _data: any = pruebas;


    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }


    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('api/votaciones/obtener-poderdantes', 250)
            .reply(() => {
                const contacts = cloneDeep(this._data);
                return [200, contacts];
            })


    }



}
