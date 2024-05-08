import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { DataPrueba, DataPruebaSegundaCarga } from './data';

@Injectable({ providedIn: 'root' })
export class CreateTemplateMockApi {
    private _data: any = DataPrueba;
    private _data2: any = DataPruebaSegundaCarga;


    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('api/creacion-plantillas-preguntas', 250)
            .reply(() => {
                const contacts = cloneDeep(this._data);
                return [200, contacts];
            })

        this._fuseMockApiService
            .onGet('api/obtener-formulario-accionista', 250)
            .reply(() => {
                const res = cloneDeep(this._data2);
                return [500, res];
            })

        this._fuseMockApiService
            .onPost('api/inicializar-formulario-asamblea', 250)
            .reply(() => {
                const res = {
                    status: 'ok'
                }
                return [200, res];
            })
    }



}
