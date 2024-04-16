import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { PostulanteComponent } from 'app/shared/components/postulante/postulante.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPostulacionesComponent } from './resumenPostulaciones/resumenPostulaciones.component';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PostulanteComponent,
        ResumenPostulacionesComponent,
        PlanchaPostulanteComponent,
        AngularMaterialModules
    ],
    templateUrl: 'postulaciones.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostulacionesComponent {

    @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

    // Variables comite Escrutador
    primerPostulanteComiteEscrutador: any = undefined;
    segundoPostulanteComiteEscrutador: any = undefined;
    contieneDatosPrimerPostulanteCE: boolean = false;
    contieneDatosSegundoPostulanteCE: boolean = false;

    // Variables


    // dialogo
    dialogRef: MatDialogRef<any>;

    constructor(public dialog: MatDialog) {
    }

    // Sección Recibir componentes hijos (app-postulante) COMITE ESCRUTADOR
    primerPostulanteCEscrutador(datosPostulante) {
        this.primerPostulanteComiteEscrutador = datosPostulante
    }

    segundoPostulanteCEscrutador(datosPostulante) {
        this.segundoPostulanteComiteEscrutador = datosPostulante
    }

    existenDatosPrimerPostulanteCE(validacion) {
        this.contieneDatosPrimerPostulanteCE = validacion
    }

    existenDatosSegundoPostulanteCE(validacion) {
        this.contieneDatosSegundoPostulanteCE = validacion
    }

    validacionComiteEscrutador(): boolean {
        return !!(this.primerPostulanteComiteEscrutador?.valid && this.segundoPostulanteComiteEscrutador?.valid) && !!(this.contieneDatosPrimerPostulanteCE && this.contieneDatosSegundoPostulanteCE)
    }

    enviarPostulacionComiteEscrutador() {
        const { tipoAccionista: tipoAccionistaPrimerPostulante } = this.primerPostulanteComiteEscrutador?.value
        const { tipoAccionista: tipoAccionistaSegundoPostulante } = this.segundoPostulanteComiteEscrutador?.value

        if (tipoAccionistaPrimerPostulante === tipoAccionistaSegundoPostulante) {
            this.abrirDialogo()
            return
        }

        console.log("tipoAccionistaPrimerPostulante", tipoAccionistaPrimerPostulante)
        console.log("tipoAccionistaSegundoPostulante", tipoAccionistaSegundoPostulante)

        let postulacion = [
            this.primerPostulanteComiteEscrutador?.value,
            this.segundoPostulanteComiteEscrutador?.value
        ]
        console.log(postulacion)
    }
    // Fin validaciones y recibir data componentes hijos (app-postulante)


    //alerta de dialogo
    abrirDialogo(): void {
        this.dialogRef = this.dialog.open(this.dialogTemplate);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return

        });
    }


    cerrarDialogo() {
        this.dialogRef.close(false);
    }




}
