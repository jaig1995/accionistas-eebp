import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { eebpTheme } from 'app/shared/imports/temaPicker/temaPicker';
import { DateTime } from 'luxon';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AsambleaService } from '../../asamblea.service';

@Component({
    selector: 'app-ver-mas-modal',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        NgxMaterialTimepickerModule,
        TimepickerModule,
        AngularMaterialModules
    ],
    templateUrl: 'verMasModal.component.html',
})
export class VerMasModalComponent implements OnInit {

    private dialogRef = inject(MatDialogRef<VerMasModalComponent>);
    private formBuilder = inject(FormBuilder);
    private _asambleaService = inject(AsambleaService);

    estadoBoton
    asambleaForm
    eebpTheme = eebpTheme;
    horaAsamblea: any;
    tipoAsamblea: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,) {
    }

    ngOnInit(): void {
        this.inicializarDatos()

    }

    inicializarDatos() {
        this.estadoBoton = this.data.asamblea.estado
        this.horaAsamblea = this.data.asamblea.horaAsamblea
        this.tipoAsamblea = this.data.asamblea.tipoAsamblea

        this.asambleaForm = this.formBuilder.group({
            consecutivo: [''],
            fechaAsamblea: [''],
            horaAsamblea: [''],
            estado: ['', Validators.required],
            tipoAsamblea: ['', Validators.required]
        });
        this.asambleaForm.patchValue(this.data.asamblea);
    }


    modificarAsamblea(){
        const formValue = this.asambleaForm.value;
        const fechaAsamblea = new Date(formValue.fechaAsamblea);
        const fechaFormateada = DateTime.fromJSDate(fechaAsamblea).toFormat('yyyy-dd-MM');
        const valoresActualizados = { ...formValue, fechaAsamblea: fechaFormateada };
        this.enviarPeticionModificarAsamblea(valoresActualizados)
    }


    enviarPeticionModificarAsamblea(data){
        this._asambleaService.modificarAsamblea(data).subscribe({
            next:(data)=>{
                this.dialogRef.close({ success: true });
            },
            error:(error)=>{
                this.dialogRef.close({ success: false });
            }
        })
    }


}
