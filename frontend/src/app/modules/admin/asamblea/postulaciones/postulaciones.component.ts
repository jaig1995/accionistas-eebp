import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';

import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseLoadingService } from '@fuse/services/loading';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';

import { AsambleaService } from '../asamblea.service';
import { PostulanteComponent } from 'app/shared/components/postulante/postulante.component';
import { ResumenPostulacionesComponent } from './resumenPostulaciones/resumenPostulaciones.component';
import { PlanchaPostulanteComponent } from 'app/shared/components/planchaPostulante/planchaPostulante.component';

@Component({
    selector: 'app-postulaciones',
    standalone: true,
    imports: [
        CommonModule,
        PostulanteComponent,
        ResumenPostulacionesComponent,
        PlanchaPostulanteComponent,
        FuseLoadingBarComponent,
        FuseAlertComponent,
        AngularMaterialModules
    ],
    templateUrl: 'postulaciones.component.html',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PostulacionesComponent {

    //inyeccion de dependencias
    private asambleaService = inject(AsambleaService);
    private _fuseLoadingService = inject(FuseLoadingService);

    //variables componentes hijos
    @ViewChildren(PostulanteComponent) postulanteComponents: QueryList<PostulanteComponent>;
    @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

    //Variable mensaje Dialogo alertas
    mensajeAlertas: String = ''

    //validaciones
    showSuccesAlert = false;
    showFailedAlert = false;
    botonActivo = false;

    // Variables comite Escrutador
    primerPostulanteComiteEscrutador: any = undefined;
    segundoPostulanteComiteEscrutador: any = undefined;
    contieneDatosPrimerPostulanteCE: boolean = false;
    contieneDatosSegundoPostulanteCE: boolean = false;

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

    // validacion del html
    validacionComiteEscrutador(): boolean {
        return !!(this.primerPostulanteComiteEscrutador?.valid && this.segundoPostulanteComiteEscrutador?.valid) && !!(this.contieneDatosPrimerPostulanteCE && this.contieneDatosSegundoPostulanteCE)
    }
    // fin seccion


    enviarPostulacionComiteEscrutador() {
        const { tipoAccionista: tipoAccionistaPrimerPostulante, documentoIdentidad: documentoAccionistaPrimerPostulante } = this.primerPostulanteComiteEscrutador?.value
        const { tipoAccionista: tipoAccionistaSegundoPostulante, documentoIdentidad: documentoAccionistaSegundoPostulante } = this.segundoPostulanteComiteEscrutador?.value

        if (tipoAccionistaPrimerPostulante === tipoAccionistaSegundoPostulante) {
            this.mensajeAlertas = `Por favor, ten en cuenta que solo debe haber un postulante <span class="text-accent font-bold">PRINCIPAL</span> y
            uno <span class="text-primary font-bold">SUPLENTE</span>.`
            this.abrirDialogo();
            return
        }

        if (documentoAccionistaPrimerPostulante === documentoAccionistaSegundoPostulante) {
            this.mensajeAlertas = `Por favor, ten en cuenta que deben ser <span class="font-bold">diferente</span> el postulante <span class="text-accent font-bold">PRINCIPAL</span> del <span class="text-primary font-bold">SUPLENTE</span>.`
            this.abrirDialogo();
            return
        }

        let postulacion = [
            this.primerPostulanteComiteEscrutador?.value,
            this.segundoPostulanteComiteEscrutador?.value
        ]

        const data = {
            comiteEscrutador: postulacion
        }

        this.enviarPostulacion(data)
    }



    //peticiones http
    enviarPostulacion(postulantes) {
        this.botonActivo = true
        this.asambleaService.registrarPostulantes(postulantes).subscribe({
            next: (data) => {
                this.botonActivo = false
                console.log("MockAPI dataFake => 'api/asamblea/postulaciones'",data)
                this.postulanteComponents.forEach(c => {
                    c.borrarFormulario()
                })
                this.mostrarAlertaExitosa()

            },
            error: (data) => {
                this.botonActivo = false
                this.mostrarAlertaFallida()
            },
            complete: () => {
                this.botonActivo = false
                console.log(this.botonActivo )
            }
        })
    }

    // seccion alerta de dialogo
    abrirDialogo(): void {
        this.dialogRef = this.dialog.open(this.dialogTemplate);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return

        });
    }

    cerrarDialogo() {
        this.dialogRef.close(false);
    }

    //fin seccion


    // seccion mostrar alertas
    mostrarAlertaExitosa(): void {
        this.showSuccesAlert = true;
        setTimeout(() => {
            this.showSuccesAlert = false;
        }, 3000);
    }

    mostrarAlertaFallida(): void {
        this.showFailedAlert = true;
        setTimeout(() => {
            this.showFailedAlert = false;
        }, 3000);
    }
    //fin seccion
}
