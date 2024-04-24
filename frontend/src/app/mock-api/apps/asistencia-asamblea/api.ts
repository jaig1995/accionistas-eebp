import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { ejemploAsistenciaAsamblea, ejemploDatosAsamblea } from './data';

@Injectable({ providedIn: 'root' })
export class AsitenciaAsambleaMockApi {
    private _data: any[] = ejemploAsistenciaAsamblea;
    private _dataAsamblea: any = ejemploDatosAsamblea;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('api/asamblea/obtener-asitentes-asamblea', 2000)
            .reply(() => {
                const asistentes = cloneDeep(this._data);
                return [200, asistentes];
            })



        this._fuseMockApiService
            .onGet('api/asamblea/obtener-datos-asamblea', 2000)
            .reply(() => {
                const asistentes = cloneDeep(this._dataAsamblea);
                return [200, asistentes];
            })



        this._fuseMockApiService
            .onPost('api/asamblea/registrar-asitente-asamblea', 2000)
            .reply(() => {

                const json = {
                    pruebas: "Ok"
                }

                return [200, json]
            })
    }
}
