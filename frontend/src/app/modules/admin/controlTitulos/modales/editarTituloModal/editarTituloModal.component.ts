import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { fuseLoadingInterceptor } from '../../../../../../@fuse/services/loading/loading.interceptor';
import { ControlTitulosService } from '../../controlTitulos.service';

@Component({
    selector: 'app-editar-titulo-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: 'editarTituloModal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarTituloModalComponent {

    consecutivoTitulo: any;
    formularioEditar: any;
    constructor(public dialogRef: MatDialogRef<EditarTituloModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private controlTitulosService: ControlTitulosService,) {
        console.log(data)

        this.consecutivoTitulo = data.editarTitulo.conseTitulo

        this.formularioEditar = this.formBuilder.group({
            conseTitulo: [this.data.editarTitulo.conseTitulo],
            canAccTit: [this.data.editarTitulo.canAccTit],
            valAccTit: [this.data.editarTitulo.valAccTit],
            claAccTit: [this.data.editarTitulo.claAccTit],
            tipAccTit: [this.data.editarTitulo.tipAccTit],
            fecCreTit: [this.data.editarTitulo.fecCreTit],
            fecFinTit: [this.data.editarTitulo.fecFinTit],
            obsAccTit: [this.data.editarTitulo.obsAccTit],
            folio: [this.data.editarTitulo.folio, Validators.required],
            ideEstadoTitulo: [this.data.editarTitulo.estadoTitulo.ideEstadoTitulo],
            descEstado: [this.data.editarTitulo.estadoTitulo.descEstado]
        });


        console.log("---->", this.formularioEditar.value)
    }


    onSubmit() {
        const { descEstado, ideEstadoTitulo, ...rest } = this.formularioEditar.value;

        const editar = {
            ...rest,
            estadoTitulo: {
                ideEstadoTitulo
            }
        }

        this.controlTitulosService.editarTitulo(editar).subscribe({
            next: (data) => {

                this.dialogRef.close({ success: true });
            },
            error: (data) => {
                this.dialogRef.close({ success: false });
            }
        })
        console.log(editar)
    }
}
