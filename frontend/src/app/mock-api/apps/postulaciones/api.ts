import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { ejemploResumenPostulantes } from './data';

@Injectable({ providedIn: 'root' })
export class PostulacionesMockApi {
    private _data: any = ejemploResumenPostulantes;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('api/asamblea/obtener-postulaciones', 2000)
            .reply(() => {
                const contacts = cloneDeep(this._data);
                return [200, contacts];
            })



        this._fuseMockApiService
            .onPost('api/asamblea/postulaciones', 2000)
            .reply(() => {

                const json = {
                    "comiteEscrutador": [
                        {
                            "tipoAccionista": "principal",
                            "nombresApellidos": "CRISTINA",
                            "telefono": "5656",
                            "documentoIdentidad": "123456",
                            "correoElectronico": "HOLA@GMIAL.COM"
                        },
                        {
                            "tipoAccionista": "suplente",
                            "nombresApellidos": "PRUEBA JUAN CAMILO",
                            "telefono": "123",
                            "documentoIdentidad": "0010",
                            "correoElectronico": "HOLA@GMIAL.COM"
                        }
                    ]
                }

                return [200, json]
            })
    }
}
