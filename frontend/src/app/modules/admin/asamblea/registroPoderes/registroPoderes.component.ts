

import { AfterViewInit, Component, inject, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { utils, writeFileXLSX } from 'xlsx';
import { ServicesConfig } from 'app/services.config';
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
        FuseLoadingBarComponent,
        AngularMaterialModules
    ],
    templateUrl: 'registroPoderes.component.html',
    // encapsulation: ViewEncapsulation.Emulated,
    animations: fuseAnimations,
})
export class RegistroPoderesComponent implements AfterViewInit {

    @ViewChildren(InputAutocompleteComponent) inputAutocompleteComponents: QueryList<InputAutocompleteComponent>;

    private asambleaService = inject(AsambleaService);
    // private _fuseLoadingService = inject(FuseLoadingService);

    //alertas o validaciones
    loading: boolean;
    showSuccesAlert = false;
    showFailedAlert = false;
    botonActivo = false
    botonActivoAcciones = false


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

    private apiUrlDocumentos: string = ServicesConfig.apiUrlDocumentos;

    //Componentes Hijos
    @ViewChild(ButtonCargarDocumentosComponent) buttonCargarDocumentosComponent: ButtonCargarDocumentosComponent;

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'DOCUMENTO PODERDANTE', 'PODERDANTE', 'N.ACCIONES', 'APODERADO', 'DOCUMENTO APODERADO', 'ESTADO', 'ACCIONES'];
    dataSource: any = []

    //variables para formularios
    poderdanteExiste: boolean = false;
    esValidoPoderdante: boolean;
    esValidoApoderado: boolean;

    //variable validacion,y archivo seleccionado desde el hijo
    existeDocumento: boolean = false;
    archivoRegistroPoderantes: any;

    // dialogo
    dialogRef: MatDialogRef<any>;
    consecutivo: any = 25;

    constructor(public dialog: MatDialog) {
        DateTime.local().setLocale('es');
        this.cargarDatos()
    }

    cargarDatos() {
        this.asambleaService.obtenerRegistradosPoderes().subscribe({
            next: (data) => {
                console.log('💻🔥 101, registroPoderes.component.ts: ', data);
                this.dataSource = new MatTableDataSource<any>(data)
                this.dataSource.paginator = this.paginator
            },
            error: (data) => {
                this.dataSource = []
            }
        }
        )
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
        console.log('💻🔥 152, registroPoderes.component.ts: ', archivo);
        //todo:corregir numero consecutivo
        this.archivoRegistroPoderantes = archivo
        console.log(archivo)
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


        if (!this.poderdanteValor || !this.apoderadoValor) return
        let fecha = DateTime.now().toFormat('dd/MM/yy', { locale: "es" })
        let hora = DateTime.local().toFormat('hh:mm a');
        this.nombreArchivo = `formatoRegistroPoder_${this.poderdanteValor}`
        let registroPoderes = {
            idPoderdante: this.poderdanteValor,
            idApoderado: this.apoderadoValor,

        }
        this.buttonCargarDocumentosComponent.enviarArchivo(this.nombreArchivo)
        this.enviarPeticionRegistro(registroPoderes)
    }

    //peticiones http
    enviarPeticionRegistro(registroPoderes: any) {
        this.botonActivo = true

        this.asambleaService.registrarPoder(registroPoderes).subscribe(
            {
                next: (data) => {
                    console.log("data")
                    this.asambleaService.enviarArchivo(this.archivoRegistroPoderantes).subscribe(
                        {
                            next: (data) => {
                                this.mostrarAlertaExitosa();
                                this.botonActivo = false;
                                this.cargarDatos();
                            },
                            error: (data) => {
                                this.mostrarAlertaFallida()
                                this.botonActivo = false
                            },
                            complete: () => {
                                this.botonActivo = false
                                this.inputAutocompleteComponents.forEach(c => {
                                    c.borrarFormulario()
                                })
                            }
                        }
                    )
                },
                error: (data) => {
                    this.mostrarAlertaFallida()
                },
                complete: () => {

                }
            }
        )
    }

    //alerta de dialogo
    abrirDialogo(template: TemplateRef<any>, solicitud): void {
        this.dialogRef = this.dialog.open(template);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return
            const { estado, consecutivo } = solicitud
            this.aprobarRechazarPoder(consecutivo, { estado: 'RECHAZADO' })
        });
    }

    //Acciones solicitudes
    aprobarSolicitud(solicitud) {
        if (!solicitud) return
        const { estado, consecutivo } = solicitud
        this.aprobarRechazarPoder(consecutivo, { estado: 'APROBADO' })
        this.cargarDatos()
    }


    aprobarRechazarPoder(consecutivo, estado) {
        this.asambleaService.aprobarRechazarPoder(consecutivo, estado).subscribe(
            {
                next: (data) => {
                    this.mostrarAlertaExitosa();
                    this.cargarDatos()
                },
                error: (error) => {
                    this.mostrarAlertaFallida
                },
                complete: () => {
                    this.botonActivoAcciones = false
                }
            }
        )
    }

    cerrarDialogo() {
        this.dialogRef.close(false);
    }

    aprobarDialogo() {
        this.dialogRef.close(true);
    }

    editarSolicitud(solicitud) {
        console.log(solicitud);
    }

    getColor(estado: string): string {
        switch (estado) {
            case 'TRAMITE':
                return '#002E5F';
            case 'APROBADO':
                return '#5A9C30';
            case 'RECHAZADO':
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

    generarExcel() {
        //datos para exportar a PDF
        const datosRegistroPoderes = this.dataSource.data
        //se renombra los datos del objeto para que sean cabeceras de excel
        const ws_registro_poderes = datosRegistroPoderes.map(({ consecutivo: consecutivo, idPoderdante: documento_poderdante, nombrePoderdante: nombre_poderdante, accionesPoderdante: acciones_poderdante, idApoderado: documento_apoderado, nombreApoderado: nombre_apoderado, ...resto }) => ({ consecutivo, documento_poderdante, nombre_poderdante, acciones_poderdante, documento_apoderado, nombre_apoderado, ...resto }));
        //se agrega una hoja excel
        const ws = utils.json_to_sheet(ws_registro_poderes);
        //se crea un libro de excel
        const wb = utils.book_new();
        //agregamos una hoja al libro (wb workBook) (ws workSheet)
        utils.book_append_sheet(wb, ws, "Registro_poderes");
        //exportamos el libro excel
        writeFileXLSX(wb, `Registro_poderes_asamblea_${this.consecutivo}.xlsx`, { compression: true });

    }

}
