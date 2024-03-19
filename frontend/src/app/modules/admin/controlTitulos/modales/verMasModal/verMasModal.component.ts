import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ServicesConfig } from 'app/services.config';
import { MatButtonModule } from '@angular/material/button';

import { ControlTitulosService } from '../../controlTitulos.service';

@Component({
    selector: 'app-ver-mas-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule

    ],
    templateUrl: 'verMasModal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class VerMasModalComponent {

    // url backend
    private apiUrlDocumentos: string = ServicesConfig.apiUrlDocumentos;


    // variables generales de la transaccion
    consecutivoTransaccion: any;
    estadoTransaccion: any;
    fechaTransaccion: any;
    idPersona: any;
    tipoTransaccion: any;
    titulosEnTransaccion: any;
    archivosTransaccion: any;


    constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<VerMasModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private controlTitulosService: ControlTitulosService) {
        // incializacion de variables desde el componente padre (MODAL INFORMATIVO)
        const { conseTrans, estadoTransaccion, fecTrans, idePer, tipoTransaccion, transaccionTitulo, files } = data.transaccion
        this.estadoTransaccion = estadoTransaccion
        this.consecutivoTransaccion = conseTrans
        this.fechaTransaccion = fecTrans.split('T')[0];
        this.idPersona = idePer
        this.tipoTransaccion = tipoTransaccion
        this.titulosEnTransaccion = transaccionTitulo
        this.archivosTransaccion = files.map(item => {
            return {
                fileName: item.fileName,
                url: this.apiUrlDocumentos + item.url
            };
        });
    }

}
