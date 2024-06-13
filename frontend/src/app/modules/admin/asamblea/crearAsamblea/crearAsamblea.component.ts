import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { DateTime } from 'luxon';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { eebpTheme } from '../../../../shared/imports/temaPicker/temaPicker';
import { AsambleaService } from '../asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';
import { VerMasModalComponent } from './verMasModal/verMasModal.component';

@Component({
    selector: 'app-crear-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonCargarDocumentosComponent,
        TimepickerModule,
        ReactiveFormsModule,
        NgxMaterialTimepickerModule,
        FuseLoadingBarComponent,
        FuseAlertComponent,
        AngularMaterialModules,

    ],
    templateUrl: 'crearAsamblea.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export default class CrearAsambleaComponent implements OnInit, AfterViewInit {

    //inyeccion de dependencias
    private formBuilder = inject(FormBuilder);
    private asambleaService = inject(AsambleaService);
    private dialog = inject(MatDialog)

    today: Date = new Date();

    //validaciones
    botonActivo = false

    //temaEEBP
    eebpTheme = eebpTheme;

    //alertas o validaciones
    showSuccesAlert = false;
    showFailedAlert = false;
    existeDocumento: boolean = false;
    loading: boolean;
    archivoImagen: any;
    mensajeError : string = "¡Transacción no exitosa!";

    //formulario
    crearAsamblea = this.formBuilder.group({

        fechaAsamblea: ['', [Validators.required,]],
        horaAsamblea: ['', Validators.required],
        tipoAsamblea: ['', Validators.required],

    });

    //nombre y validacion archivo
    nombreArchivo: string

    //Componentes Hijos
    @ViewChild(ButtonCargarDocumentosComponent) buttonCargarDocumentosComponent: ButtonCargarDocumentosComponent;

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'FECHA_ASAMBLEA', 'HORA_ASAMBLEA', 'TIPO', 'ESTADO', 'VER_MAS', 'ACCIONES'];
    dataSource: any = []
    consecutivoAsamblea: any;
    datosTabla: any[];



    constructor() {
    }

    ngOnInit(): void {
        this.CargarDatos()
        // this.obtenerConsecutivo()
    }


    ngAfterViewInit() {
        // this.obtenerConsecutivo()
        this.CargarDatos()
    }

    CargarDatos() {
        this.asambleaService.obtenerAsambleas().subscribe(
            {
                next: (data) => {
                    this.datosTabla = data
                    this.dataSource = new MatTableDataSource<any>(this.datosTabla)
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                },
                error: (data) => {
                    this.dataSource = []
                }
            }
        )

    }

    obtenerConsecutivo() {
        this.asambleaService.obtenerConsecutivosAsamblea().subscribe({
            next: (data: any) => {
                this.consecutivoAsamblea = data.consecutivoAsamblea;
                // this.crearAsamblea.get('consecutivoAsamblea').setValue(this.consecutivoAsamblea);
            },
            error: (data) => {
                this.dataSource = []
            }
        })
    }


    enviarInvitacion(consecutivo){
        console.log(consecutivo)
        this.asambleaService.enviarInvitacionAsamblea(consecutivo).subscribe({
            next:(data)=>{
                this.mostrarAlertaExitosa()
            },
            error:() =>{
                this.mostrarAlertaFallida()
            }
        })
    }
    enviarFormularioAsamblea() {
        this.botonActivo = true
        const formValue = this.crearAsamblea.value;
        const fechaAsamblea = new Date(formValue.fechaAsamblea);
        console.log(fechaAsamblea)
        const fechaFormateada = DateTime.fromJSDate(fechaAsamblea).toFormat('yyyy-MM-dd');
        const valoresActualizados = { ...formValue, fechaAsamblea: fechaFormateada };
        this.nombreArchivo = `imagen_asamblea_numero_${this.consecutivoAsamblea}`
        this.buttonCargarDocumentosComponent.enviarArchivo(this.nombreArchivo)
        this.enviarPeticionAsamblea(valoresActualizados)
    }

    enviarPeticionAsamblea(data) {
        this.asambleaService.crearAsamblea(data).subscribe({
            next: (data) => {
                this.asambleaService.enviarArchivo(this.archivoImagen).subscribe(
                    {
                        next: (data) => {
                            this.botonActivo = false
                            this.mostrarAlertaExitosa();
                            this.CargarDatos();
                        },
                        error: (data) => {
                            console.log('💻🔥 164, crearAsamblea.component.ts: ', data);
                            this.botonActivo = false
                            this.mostrarAlertaFallida()
                        },
                        complete: () => {
                            this.botonActivo = false

                        }
                    }
                )
            },
            error: (data) => {
                this.botonActivo = false
                this.mostrarAlertaFallida();
                this.mensajeError="Solo puede crearse una asamblea ORDINARIA por año"
            }
        })
    }


    //tablas
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    //peticiones http


    contieneArchivo(valor: boolean) {
        this.existeDocumento = valor
    }

    recibirArchivo(archivo) {
        this.archivoImagen = archivo
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

    getColor(estado: string): string {
        switch (estado) {
            case 'Inactiva':
                return '#D6DCE4';
            case 'Activa':
                return '#5A9C30';
            default:
                return 'black';
        }
    }


    /**
    * Método para rechazar una transacción.
    * @param {any} element - Elemento que se va a rechazar.
    */
    abirModalVerMas(asamblea) {
        const dialogRef = this.dialog.open(VerMasModalComponent, {
            width: '550px',
            height: '400px',
            data: {
                asamblea
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {

                this.mostrarAlertaExitosa()
                this.CargarDatos()
            } else {
                this.mostrarAlertaFallida()
            }
        });
    }


}
