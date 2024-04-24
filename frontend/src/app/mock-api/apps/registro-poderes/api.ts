import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { ejemploRegistradosAsamblea } from './data';

@Injectable({ providedIn: 'root' })
export class RegistroPoderesMockApi {
    private _data: any[] = ejemploRegistradosAsamblea;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('api/asamblea/obtener-registro-poderes', 2000)
            .reply(() => {
                const contacts = cloneDeep(this._data);
                return [200, contacts];
            })



        this._fuseMockApiService
            .onPost('api/asamblea/registro-poderes', 2000)
            .reply(() => {

                const json = {
                    pruebas: "Ok"
                }

                return [200, json]
            })
    }
}
