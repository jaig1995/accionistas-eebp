import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { ejemploConsecutivo, ejemploCrearActa } from './data';

@Injectable({ providedIn: 'root' })
export class CrearAsambleaMockApi {
    private _data: any = ejemploCrearActa;
    private _consecutivo = ejemploConsecutivo;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        // this._fuseMockApiService
        //     .onGet('api/asamblea/obtener-asambleas', 2000)
        //     .reply(() => {
        //         const asambleas = cloneDeep(this._data);
        //         return [200, asambleas];
        //     })



        // this._fuseMockApiService
        //     .onPost('api/asamblea/crear-asamblea', 2000)
        //     .reply(() => {

        //         const json = {
        //             "res":true
        //         }
        //         return [200, json]
        //     })


        // this._fuseMockApiService
        //     .onGet('api/asamblea/obtener-consecutivo-asamblea')
        //     .reply(() => {
        //         const consecutivo = cloneDeep(this._consecutivo);
        //         return [200, consecutivo];
        //     })
    }
}
