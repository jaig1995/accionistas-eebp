

import { AfterViewInit, Component, inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, forkJoin, throwError } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseAlertComponent } from '@fuse/components/alert';

import { DateTime } from 'luxon';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';

import { AsambleaService } from '../asamblea.service';
import { AccionistaInputAutoComplete } from 'app/shared/components/interfaces/accionista.interface';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-registro-poderes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertComponent,
        InputAutocompleteComponent,
        ButtonCargarDocumentosComponent,
        AngularMaterialModules
    ],
    templateUrl: 'registroPoderes.component.html',
    encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
})
export class RegistroPoderesComponent implements AfterViewInit {
    private asambleaService = inject(AsambleaService);

    //alertas o validaciones
    loading: boolean;
    showSuccesAlert = false;
    showFailedAlert = false;

    //variables componentes
    poderdante: AccionistaInputAutoComplete
    apoderado: AccionistaInputAutoComplete;
    inputApoderado: string;
    inputPoderdante: string

    //valor final
    poderdanteValor: any
    apoderadoValor: any

    //validaciones
    isValid: boolean;

    //nombre y validacion archivo
    nombreArchivo: string

    //Componentes Hijos
    @ViewChild(ButtonCargarDocumentosComponent) buttonCargarDocumentosComponent: ButtonCargarDocumentosComponent;

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'DOCUMENTO PODERDANTE', 'PODERDANTE', 'N.ACCIONES', 'APODERADO', 'DOCUMENTO APODERADO', 'ESTADO', 'ACCIONES'];
    ejemplo = [
        { consecutivo: 1, idPoderdante: '1144160583', nombrePoderdante: 'John Chicaiza', accionesPoderdante: 125, nombreApoderado: 'Mayerlin Yandar', idApoderado: '1085331567', estado: "Tramite" },
        { consecutivo: 2, idPoderdante: '1133432341', nombrePoderdante: 'Alexander Gavilanes', accionesPoderdante: 777, nombreApoderado: 'Mireya Rosero', idApoderado: '1085234678', estado: "Aprobado" },
        { consecutivo: 3, idPoderdante: '1084765234', nombrePoderdante: 'Alejandro Chicaiza', accionesPoderdante: 670, nombreApoderado: 'Aida Jimenez', idApoderado: '1133567234', estado: "Rechazado" }
    ]
    dataSource = new MatTableDataSource<any>(this.ejemplo)

    //variables para formularios
    poderdanteExiste: boolean = false;
    esValidoPoderdante: boolean;
    esValidoApoderado: boolean;

    //variable validacion,y archivo seleccionado desde el hijo
    existeDocumento: boolean = false;
    archivoRegistroPoderantes: any;

    // dialogo
    dialogRef: MatDialogRef<any>;

    constructor(public dialog: MatDialog) {
        DateTime.local().setLocale('es');
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    //Datos Poderdante
    obtenerInputPoderdante(valor: string) {
        //obtener el valor que viene del componente hijo de la digitacion del input
        this.inputPoderdante = valor;
        // darle valor dependiendo si es por autocomplete o es por digitacion en el input
        this.poderdanteValor = !this.inputPoderdante.length ? this.poderdante?.idPer : this.inputPoderdante
    }

    obtenerPoderdante(valor: AccionistaInputAutoComplete) {
        //obtener el valor que viene del componente hijo de la seleccion del autocomplete
        this.poderdante = valor;
        // darle valor dependiendo si es por autocomplete o es por digitacion en el input
        this.poderdanteValor = !this.poderdante ? this.inputPoderdante : this.poderdante?.idPer

    }

    //Datos Apoderado
    obtenerInputApoderado(valor: string) {
        this.inputApoderado = valor;
        this.apoderadoValor = !this.inputApoderado.length ? this.apoderado?.idPer : this.inputApoderado

    }
    obtenerApoderado(valor: AccionistaInputAutoComplete) {
        this.apoderado = valor;
        this.apoderadoValor = !this.apoderado ? this.inputApoderado : this.apoderado?.idPer
    }

    //Errores del formulario
    errorFormularioPoderdante(valor: boolean) {
        this.esValidoPoderdante = valor
    }
    errorFormularioApoderado(valor: boolean) {
        this.esValidoApoderado = valor
    }

    recibirArchivo(archivo) {
        this.archivoRegistroPoderantes = archivo
    }

    contieneArchivo(valor: boolean) {
        this.existeDocumento = valor
    }


    //tablas
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    // enviar el formulario de registro y el archivo
    enviarRegistroPoderes() {
        this.mostrarAlertaExitosa()
        if (!this.poderdanteValor || !this.apoderadoValor) return
        let fecha = DateTime.now().toFormat('dd/MM/yy', { locale: "es" })
        let hora = DateTime.local().toFormat('hh:mm a');
        this.nombreArchivo = `formatoRegistroPoder_${this.poderdanteValor}`
        let registroPoderes = {
            idPoderdante: this.poderdanteValor,
            idApoderadoValor: this.apoderadoValor,
            fecha,
            hora
        }
        this.buttonCargarDocumentosComponent.enviarArchivo(this.nombreArchivo)
        this.enviarPeticionRegistro(registroPoderes)
    }

    //peticiones http
    enviarPeticionRegistro(registroPoderes: any) {
        forkJoin([
            this.asambleaService.enviarArchivo(this.archivoRegistroPoderantes).pipe(
                catchError(error => {
                    console.error('Error en enviarArchivo:', error);
                    return throwError(error);
                })
            ),
            this.asambleaService.enviarRegistroPoderesregistro(registroPoderes).pipe(
                catchError(error => {
                    console.error('Error en enviarRegistroPoderesregistro:', error);
                    return throwError(error);
                })
            )
        ]).subscribe(([archivoRespuesta, registroRespuesta]) => {
            // Maneja las respuestas aquí si es necesario
            console.log('Respuesta de enviarArchivo:', archivoRespuesta);
            console.log('Respuesta de enviarRegistroPoderesregistro:', registroRespuesta);
        });
    }

    //alerta de dialogo
    abrirDialogo(template: TemplateRef<any>, solicitud): void {
        this.dialogRef = this.dialog.open(template);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return
            solicitud.estado = 'Rechazado';
            console.log("solicitud", solicitud)
        });
    }

    cerrarDialogo() {
        this.dialogRef.close(false);
    }

    aprobarDialogo() {
        this.dialogRef.close(true);
    }


    //Acciones solicitudes
    aprobarSolicitud(solicitud){
        solicitud.estado = 'Aprobado';
        console.log(solicitud);
    }

    editarSolicitud(solicitud){
        console.log(solicitud);
    }



    getColor(estado: string): string {
        switch (estado) {
            case 'Tramite':
                return '#002E5F';
            case 'Aprobado':
                return '#5A9C30';
            case 'Rechazado':
                return '#DC2625';
            default:
                return 'black';
        }
    }


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
