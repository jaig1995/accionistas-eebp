import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { AccionistaInputAutoComplete } from 'app/shared/components/interfaces/accionista.interface';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../../asamblea/asamblea.service';
import { ServicesConfig } from 'app/services.config';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        FuseLoadingBarComponent,
        FuseAlertComponent,
        InputAutocompleteComponent,
        ReactiveFormsModule
    ],
    templateUrl: 'reportes.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations,
})
export class ReportesComponent implements OnInit {

    //inyeccion de dependencias
    private _asambleaService = inject(AsambleaService);
    private fb = inject(FormBuilder);

    // variable de entorno
    private apiUrlDocumentos: string = ServicesConfig.apiUrlDocumentos;

    //variables alertas
    showSuccesAlert = false;
    showFailedAlert = false;

    //variables recbir componentes
    poderdante: AccionistaInputAutoComplete;
    inputPoderdante: string;
    poderdanteValor: string;
    esValidoPoderdante: boolean;

    //variables archivos
    formatoDeSucesionDeAcciones: any;
    formatoDeEndosoIndividual: any;
    formatoDeDonacionDeAcciones: any;
    formatoDeCompraVentaNatural: any;
    formatoDeCompraVentaMenores: any;
    formatoDeCompraVentaJuridicas: any;

    //variables obtener listado asamblea
    asamableasListado = [];
    seleccionAsamblea: number | null = null;

    //variables REPORTES asamblea
    reporteActaCierrePostulaciones: string;
    reporteActaEscrutinio: string;
    reporteActaPoderes: string;
    reporteActaReforma: string;
    reporteActaRevisoriaFiscal: string;
    reportesOtroAnexo: string;

    //variables FORMATOS asamblea
    formatoActaCierrePostulacionesJuntaDirectiva: string;
    formatoAactaCierreReformaEstatutos: string;
    formatoActaCierreRevisorFiscal: string;
    formatoActaPoderes: string;
    formatoActaEscutinio: string;




    onSelectionChange(selectedNumber: number) {
        this.seleccionAsamblea = selectedNumber;
        this.obtenerReportesAsamblea(this.seleccionAsamblea)
    }



    ngOnInit(): void {
        this.obtenerReportesTitulos()
        this.obtenerAsambleasListado()
        this.obtenerFormatosAsamblea()
    }


    obtenerPoderdante(valor: AccionistaInputAutoComplete) {
        //obtener el valor que viene del componente hijo de la seleccion del autocomplete
        this.poderdante = valor;

        console.log('💻🔥 85, reportes.component.ts: ', this.poderdante.idPer);
        // darle valor dependiendo si es por autocomplete o es por digitacion en el input
        this.poderdanteValor = !this.poderdante ? this.inputPoderdante : this.poderdante?.idPer
    }


    //Datos Poderdante
    obtenerInputPoderdante(valor: string) {
        console.log('💻🔥 45, reportes.component.ts: ', valor);
        //obtener el valor que viene del componente hijo de la digitacion del input
        this.inputPoderdante = valor;
        // darle valor dependiendo si es por autocomplete o es por digitacion en el input
        this.poderdanteValor = !this.inputPoderdante.length ? this.poderdante?.idPer : this.inputPoderdante
    }


    //Errores del formulario
    errorFormularioPoderdante(valor: boolean) {
        console.log('💻🔥 56, reportes.component.ts: ', valor);
        this.esValidoPoderdante = valor
    }


    //peticiones Http
    obtenerReportesTitulos() {
        this._asambleaService.obtenerFormatosTitulos().subscribe({
            next: (data) => {
                console.log('💻🔥 117, reportes.component.ts: ', data);
                this.formatoDeCompraVentaJuridicas = `${this.apiUrlDocumentos}${data.formatoDeCompraVentaJuridicas[0]?.url}`
                this.formatoDeCompraVentaMenores = `${this.apiUrlDocumentos}${data.formatoDeCompraVentaMenores[0]?.url}`
                this.formatoDeCompraVentaNatural = `${this.apiUrlDocumentos}${data.formatoDeCompraVentaNatural[0]?.url}`
                this.formatoDeDonacionDeAcciones = `${this.apiUrlDocumentos}${data.formatoDeDonacionDeAcciones[0]?.url}`
                this.formatoDeEndosoIndividual = `${this.apiUrlDocumentos}${data.formatoDeEndosoIndividual[0]?.url}`
                this.formatoDeSucesionDeAcciones = `${this.apiUrlDocumentos}${data.formatoDeSucesionDeAcciones[0]?.url}`
            },
            error: (error) => {
                console.error('💻🔥 126, reportes.component.ts: ', error);
            }
        })
    }


    obtenerAsambleasListado() {
        this._asambleaService.obtenerAsambleas().subscribe(
            {
                next: (data) => {
                    data.map(asamblea => {
                        this.asamableasListado.push(asamblea.consecutivo)
                    })
                },
                error: (error) => {
                    console.error('💻🔥 142, reportes.component.ts: ', error);
                }
            }
        )
    }



    obtenerReportesAsamblea(id) {
        this._asambleaService.obtenerReportesPorAsamblea(id).subscribe({
            next: (data) => {
                console.log('💻🔥 71, reportes.component.ts: ', data);
                this.reporteActaCierrePostulaciones = `${this.apiUrlDocumentos}${data.actaCierrePostulaciones[0]?.url}`
                this.reporteActaEscrutinio = `${this.apiUrlDocumentos}${data.actaEscrutinio[0]?.url}`
                this.reporteActaPoderes = `${this.apiUrlDocumentos}${data.actaPoderes[0]?.url}`
                this.reporteActaReforma = `${this.apiUrlDocumentos}${data.actaReforma[0]?.url}`
                this.reporteActaRevisoriaFiscal = `${this.apiUrlDocumentos}${data.actaRevisoriaFiscal[0]?.url}`
                this.reportesOtroAnexo = `${this.apiUrlDocumentos}${data.otroAnexo[0]?.url}`
                console.log('💻🔥 154, reportes.component.ts: ', this.reporteActaCierrePostulaciones);
            },
            error: (error) => {
                console.error('💻🔥 163, reportes.component.ts: ', error);
            }
        })
    }


    obtenerFormatosAsamblea() {
        this._asambleaService.obtenerFormatosAsamblea().subscribe({
            next: (data) => {
                this.formatoActaCierrePostulacionesJuntaDirectiva = `${this.apiUrlDocumentos}${data.actaCierrePostulacionesJuntaDirectiva[0]?.url}`
                this.formatoAactaCierreReformaEstatutos = `${this.apiUrlDocumentos}${data.actaCierreReformaEstatutos[0]?.url}`
                this.formatoActaCierreRevisorFiscal = `${this.apiUrlDocumentos}${data.actaCierreRevisorFiscal[0]?.url}`
                this.formatoActaPoderes = `${this.apiUrlDocumentos}${data.actaPoderes[0]?.url}`
                this.formatoActaEscutinio = `${this.apiUrlDocumentos}${data.actaEscutinio[0]?.url}`

            },
            error: (error) => {
                console.error('💻🔥 182, reportes.component.ts: ', error);
            }
        })
    }



    obtenerCertificadoAccionista() {
        let codAccionista = this.poderdante.idPer
        if (!codAccionista) return
        this._asambleaService.obtenerCertificadoAccionista(codAccionista).subscribe({
            next: (data) => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Certificado_accionista${codAccionista}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.mostrarAlertaFallida()
                console.error('Error al descargar el archivo:', error);
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
