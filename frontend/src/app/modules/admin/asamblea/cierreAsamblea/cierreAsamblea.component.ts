import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea.service';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
    selector: 'app-cierre-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        FuseLoadingBarComponent,
        ReactiveFormsModule,
        ButtonCargarDocumentosComponent,
        FuseAlertComponent,
    ],
    templateUrl: 'cierreAsamblea.component.html',
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class CierreAsambleaComponent implements OnInit {
    private _cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private _asambleaService = inject(AsambleaService);

    @ViewChildren(ButtonCargarDocumentosComponent) buttonCargarDocumentosComponents: QueryList<ButtonCargarDocumentosComponent>;

    consecutivoAsamblea: any;

    // Validaciones archivos
    existeDocumentoActaCierrePostulaciones: boolean = false;
    existeDocumentoActaReforma: boolean = false;
    existeDocumentoActaRevisoriaFiscal: boolean = false;
    existeDocumentoActaPoderes: boolean = false;
    existeDocumentoActaEscrutinio: boolean = false;
    existeDocumentoOtroAnexo: boolean = false;

    // Variables para archivos
    archivoActaCierrePostulaciones: any;
    archivoActaReforma: any;
    archivoActaRevisoriaFiscal: any;
    archivoActaPoderes: any;
    archivoActaEscrutinio: any;
    archivoOtroAnexo: any;

    // Nombres documentos actas de cierre
    actaCierrePostulaciones = 'actacierrepostulaciones_';
    actaReforma = 'actareforma_';
    actaRevisoriaFiscal = 'actarevisoriafiscal_';
    actaPoderes = 'actapoderes_';
    actaEscrutinio = 'actaescrutinio_';
    otrosAnexos = 'actaotrosanexos_';


    //alertas
    showSuccesAlert = false;
    showFailedAlert = false;

    formulario = this.fb.group({
        numAccMercado: ['', [Validators.required, this.numberValidator]],
        numAccUtilidades: ['', [Validators.required, this.numberValidator]],
        participacionAccion: ['', [Validators.required, this.numberValidator]],
        pagoUtilidad: ['', Validators.required],
        valNomAccion: ['', [Validators.required, this.numberValidator]],
        valIntrinseco: ['', [Validators.required, this.numberValidator]],
        divParticipacion: ['', [Validators.required, this.numberValidator]],
    });

    ngOnInit(): void {
        this.obtenerConsecutivoAsamblea();
    }

    obtenerConsecutivoAsamblea() {
        this._asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next: (data) => {
                console.log('💻🔥 64, cierreAsamblea.component.ts: ', data);
                this.consecutivoAsamblea = data.ultimoConsecutivo;
            },
            error: (error) => {
                this.consecutivoAsamblea = '';
            }
        });
    }

    numberValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null; // No validar valores vacíos para permitir que el validador required los capture
        }
        return isNaN(value) ? { notANumber: true } : null;
    }

    enviarFormularioParametrizacion() {
        const { value } = this.formulario
        this.enviarDatosUtilidades(value)
        console.log('💻🔥 102, cierreAsamblea.component.ts: ', value);
    }

    // SECCIÓN RECIBIR DESDE EL COMPONENTE ARCHIVO Y VALIDACIONES

    // SECCIÓN ACTA CIERRE DE POSTULACIONES
    contieneArchivoActaPostulaciones(valor: boolean) {
        this.existeDocumentoActaCierrePostulaciones = valor;
    }

    recibirArchivoActaPostulaciones(archivo) {
        this.archivoActaCierrePostulaciones = archivo;
    }

    enviarActaPostulaciones() {
        let nombreArchivo = `${this.actaCierrePostulaciones}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[0]; // Primera instancia
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoActaCierrePostulaciones)
        this._cdr.detectChanges();
    }

    // SECCIÓN ACTA REFORMA
    contieneArchivoActaReforma(valor: boolean) {
        this.existeDocumentoActaReforma = valor;
        console.log('💻🔥 73, cierreAsamblea.component.ts: ', this.existeDocumentoActaReforma);
    }

    recibirArchivoActaReforma(archivo) {
        console.log('💻🔥 78, cierreAsamblea.component.ts: ', archivo);
        this.archivoActaReforma = archivo;
    }

    enviarActaReforma() {
        let nombreArchivo = `${this.actaReforma}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[1]; // Segunda instancia
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoActaReforma)
        this._cdr.detectChanges();
    }

    // SECCIÓN ACTA REVISORIA FISCAL
    contieneArchivoActaRevisoriaFiscal(valor: boolean) {
        this.existeDocumentoActaRevisoriaFiscal = valor;
        console.log('💻🔥 73, cierreAsamblea.component.ts: ', this.existeDocumentoActaRevisoriaFiscal);
    }

    recibirArchivoActaRevisoriaFiscal(archivo) {
        console.log('💻🔥 78, cierreAsamblea.component.ts: ', archivo);
        this.archivoActaRevisoriaFiscal = archivo;
    }

    enviarActaRevisoriaFiscal() {
        let nombreArchivo = `${this.actaRevisoriaFiscal}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[2];
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoActaRevisoriaFiscal)
    }

    // SECCIÓN ACTA PODERES
    contieneArchivoActaPoderes(valor: boolean) {
        this.existeDocumentoActaPoderes = valor;
        console.log('💻🔥 73, cierreAsamblea.component.ts: ', this.existeDocumentoActaPoderes);
    }

    recibirArchivoActaPoderes(archivo) {
        console.log('💻🔥 78, cierreAsamblea.component.ts: ', archivo);
        this.archivoActaPoderes = archivo;
    }

    enviarActaPoderes() {
        let nombreArchivo = `${this.actaPoderes}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[3];
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoActaPoderes)
    }

    // SECCIÓN ACTA ESCRUTINIO
    contieneArchivoActaEscrutinio(valor: boolean) {
        this.existeDocumentoActaEscrutinio = valor;
        console.log('💻🔥 73, cierreAsamblea.component.ts: ', this.existeDocumentoActaEscrutinio);
    }

    recibirArchivoActaEscrutinio(archivo) {
        console.log('💻🔥 78, cierreAsamblea.component.ts: ', archivo);
        this.archivoActaEscrutinio = archivo;
    }

    enviarActaEscrutinio() {
        let nombreArchivo = `${this.actaEscrutinio}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[4];
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoActaEscrutinio)
    }

    // SECCIÓN OTROS ANEXOS
    contieneArchivoOtrosAnexos(valor: boolean) {
        this.existeDocumentoOtroAnexo = valor;
        console.log('💻🔥 73, cierreAsamblea.component.ts: ', this.existeDocumentoOtroAnexo);
    }

    recibirArchivoOtroAnexo(archivo) {
        console.log('💻🔥 78, cierreAsamblea.component.ts: ', archivo);
        this.archivoOtroAnexo = archivo;
    }

    enviarActaOtroAnexo() {
        let nombreArchivo = `${this.otrosAnexos}${this.consecutivoAsamblea}`;
        const componente = this.buttonCargarDocumentosComponents.toArray()[5];
        componente.enviarArchivo(nombreArchivo);
        this.enviarArchivos(this.archivoOtroAnexo)
    }

    ///peticiones http

    enviarArchivos(archivo) {
        this._asambleaService.enviarFormatosCierreAsamblea(archivo).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                console.log('💻🔥 216, cierreAsamblea.component.ts: ', data);
            },
            error: (error) => {
                console.log('💻🔥 219, cierreAsamblea.component.ts: ', error);
                this.mostrarAlertaFallida()
            }
        })
    }


    enviarDatosUtilidades(data) {
        this._asambleaService.enviarDatosUtilidades(data).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                console.log('💻🔥 232, cierreAsamblea.component.ts: ', data);
            },
            error: (error) => {
                console.log('💻🔥 235, cierreAsamblea.component.ts: ', error);
                this.mostrarAlertaFallida()
            }
        })
    }

    //alertas
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

}
