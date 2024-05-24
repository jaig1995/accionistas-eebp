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
    private dialog = inject(MatDialog);

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
    postulanteComiteEscrutador: any;
    contieneDatospostulaneCE: any;

    // Variables presidente
    postulantePresidente: any;
    contieneDatospostulantePresidente: any;


    // Variables Aprobador Acta
    postulanteAprobadorActa: any;
    contieneDatosAA: any;

    // Variables junta directiva
    primerPostulanteJuntaDirectiva: any = undefined;
    segundoPostulanteJuntaDirectiva: any = undefined;
    contieneDatosPrimerPostulaneJD: boolean = false;
    contieneDatosSegundoPostulantJD: boolean = false;

    // Variables junta directiva
    contieneDatospostulaneRF: any;
    postulanteRevisorFiscal: any;

    // dialogo
    dialogRef: MatDialogRef<any>;


    // ======  RECIBIR DATA DE LOS COMPONENTES HIJOS ======== //

    // Sección Recibir componentes hijos (app-postulante) COMITE ESCRUTINIO
    postulanteCE(datosPostulante) {
        this.postulanteComiteEscrutador = datosPostulante
    }
    existenDatosCE(validacion) {
        this.contieneDatospostulaneCE = validacion
    }

    // Sección Recibir componentes hijos (app-postulante) COMITE ESCRUTINIO
    postulantePR(datosPostulante) {
        this.postulantePresidente = datosPostulante
    }
    existenDatosPresidente(validacion) {
        this.contieneDatospostulantePresidente = validacion
    }

    // Sección Recibir componentes hijos (app-postulante) APROBADOR ACTA
    postulanteAA(datosPostulante) {
        this.postulanteAprobadorActa = datosPostulante
    }
    existenDatosAA(validacion) {
        this.contieneDatosAA = validacion
    }

    // Sección Recibir componentes hijos (app-postulante) JUNTA DIRECTIVA
    primerPostulanteJDirectiva(datosPostulante) {
        this.primerPostulanteJuntaDirectiva = datosPostulante
    }
    segundoPostulanteJDirectiva(datosPostulante) {
        this.segundoPostulanteJuntaDirectiva = datosPostulante
    }
    existenDatosPrimerPostulanteJD(validacion) {
        this.contieneDatosPrimerPostulaneJD = validacion
    }
    existenDatosSegundoPostulanteJD(validacion) {
        this.contieneDatosSegundoPostulantJD = validacion
    }

    // Sección Recibir componentes hijos (app-postulante) REVISOR FISCAL
    postulanteRFiscal(datosPostulante) {
        this.postulanteRevisorFiscal = datosPostulante
    }
    existenDatosPostulanteRF(validacion) {
        this.contieneDatospostulaneRF = validacion
    }

    // ======  VALIDACIONES HTML  ======== //
    validacionJuntaDirectiva(): boolean {
        return !!(this.primerPostulanteJuntaDirectiva?.valid && this.segundoPostulanteJuntaDirectiva?.valid) && !!(this.contieneDatosPrimerPostulaneJD && this.contieneDatosSegundoPostulantJD)
    }
    validacionCE() {
        return !!(this.postulanteComiteEscrutador?.valid) && !!(this.contieneDatospostulaneCE)
    }
    validacionAA() {
        return !!(this.postulanteAprobadorActa?.valid) && !!(this.contieneDatosAA)
    }
    validacionPresidente() {
        return !!(this.postulantePresidente?.valid) && !!(this.contieneDatospostulantePresidente)
    }
    validacionRevisorFiscal(): boolean {
        return !!(this.postulanteRevisorFiscal?.valid) && !!(this.contieneDatospostulaneRF)
    }

    // ======  METODOS DE ENVIO ======== //
    enviarPostulacionJuntaDirectiva() {
        const { tipoAccionista: tipoAccionistaPrimerPostulante, documentoIdentidad: documentoAccionistaPrimerPostulante } = this.primerPostulanteJuntaDirectiva?.value
        const { tipoAccionista: tipoAccionistaSegundoPostulante, documentoIdentidad: documentoAccionistaSegundoPostulante } = this.segundoPostulanteJuntaDirectiva?.value
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
        let postulacion = {
            idPrincipal: this.primerPostulanteJuntaDirectiva?.value.documentoIdentidad,
            idSuplente: this.segundoPostulanteJuntaDirectiva?.value.documentoIdentidad
        }
        const data = {
            idComite: 1,
            ...postulacion
        }
        this.enviarPostulacion(data)
    }

    enviarPostulacionRevisoriaFiscal() {
        let postulacion = {
            idPrincipal: this.postulanteRevisorFiscal?.value.documentoIdentidad,
        }
        const data = {
            idComite: 5,
            ...postulacion
        }
        this.enviarPostulacion(data)
    }

    enviarPostulacionComiteEscrutinio() {
        let postulacion = {
            idPrincipal: this.postulanteComiteEscrutador?.value.documentoIdentidad,
        }
        //todo:falta id
        const data = {
            idComite: 5,
            ...postulacion
        }
        this.enviarPostulacion(data)
    }

    enviarPostulacionPresidente() {
        let postulacion = {
            idPrincipal: this.postulantePresidente?.value.documentoIdentidad,
        }
        //todo:falta id
        const data = {
            idComite: 5,
            ...postulacion
        }
        this.enviarPostulacion(data)
    }

    enviarPostulacionAprobadorActa() {
        let postulacion = {
            idPrincipal: this.postulanteAprobadorActa?.value.documentoIdentidad,
        }
        //todo:falta id
        const data = {
            idComite: 5,
            ...postulacion
        }
        this.enviarPostulacion(data)
    }

// ======  PETICIONES HTTP  ======== //
    enviarPostulacion(postulantes) {
        this.botonActivo = true
        this.asambleaService.enviarPostulante(postulantes).subscribe({
            next: (data) => {
                this.botonActivo = false
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
                console.log(this.botonActivo)
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
