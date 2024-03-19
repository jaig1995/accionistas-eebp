import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ControlTitulosService } from '../controlTitulos.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AprobarTitulos } from '../interfaces/aprobarTitulos.interface';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { AprobarModalComponent } from '../modales/aprobarModal/aprobarModal.component';
import { MatDialog } from '@angular/material/dialog';
import { RechazarModalComponent } from '../modales/rechazarModal/rechazarModal.component';
import { ServicesConfig } from 'app/services.config';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-aprobar-titulos',
    standalone: true,
    animations: fuseAnimations,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatCheckboxModule,
        FormsModule,
        FuseAlertComponent,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,


    ],
    templateUrl: 'aprobarTitulos.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AprobarTitulosComponent implements OnInit, AfterViewInit {

    // variable de entorno
    private apiUrlDocumentos: string = ServicesConfig.apiUrlDocumentos;

    //Tabla
    datosTabla: AprobarTitulos[];
    displayedColumns: string[] = ['TIPO', 'IDENTIFICACION', 'CONSECUTIVO', 'CANTIDADACCION', 'INTENCION', 'ESTADO', 'DOCUMENTO', 'TRANSACCION',];
    dataSource: any;

    private _fuseConfirmationService;

    //Tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    //spinner
    loading = false;
    showSuccesAlert = false;
    showFailedAlert = false;
    isEnableButton = false;


    constructor(private controlTitulosService: ControlTitulosService, private router: Router, private dialog: MatDialog, fuseConfirmationService: FuseConfirmationService) {
        this._fuseConfirmationService = fuseConfirmationService;
    }

    ngOnInit(): void {
        this.inicializarDatos();
    }

    ngAfterViewInit(): void {
        this.inicializarDatos();
    }

    /**
     * Muestra una alerta EXITOSA en la interfaz de usuario.
     * Establece la variable showSuccesAlert en true para mostrar la alerta y
     * luego la restablece a false después de 3000 milisegundos (3 segundos).
     */
    mostrarAlertaExitosa(): void {
        this.showSuccesAlert = true;
        setTimeout(() => {
            this.showSuccesAlert = false;
        }, 3000);
    }

    /**
     * Muestra una alerta FALLIDA en la interfaz de usuario.
     * Establece la variable showSuccesAlert en true para mostrar la alerta y
     * luego la restablece a false después de 3000 milisegundos (3 segundos).
     */
    mostrarAlertaFallida(): void {
        this.showFailedAlert = true;
        setTimeout(() => {
            this.showFailedAlert = false;
        }, 3000);
    }




    /**
     * Método para cargar los datos de transacciones desde el servicio y actualizar la tabla.
     * Este metodo realiza dos llamados para buscar el path en el cual contiene el documento
     * De la transacción de acuerdo al consecutivo de la misma.
     */
    inicializarDatos(): void {
        try {
            this.loading = true;
            this.controlTitulosService.obtenerTransacciones().subscribe({
                next: (transacciones) => {

                    const titulosEnTramite = transacciones.filter((data) => data.estadoTransaccion?.descEstado === 'En tramite')
                    this.datosTabla = titulosEnTramite.map(data => {
                        return {
                            ...data,
                            tipoTransaccionN: data.tipoTransaccion.desTran,
                        };
                    });
                    this.dataSource = new MatTableDataSource<any>(this.datosTabla);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.loading = false;
                },
                error: (data) => {
                    this.datosTabla = []
                    this.dataSource = []
                }
            })
        } catch (error) {
            this.datosTabla = []
            this.dataSource = []
        }


    }


    /**
     * Método que se ejecuta cuando cambia la selección en el filtro de categorías.
     * Filtra los datos de la tabla según el valor seleccionado en el filtro y
     * navega a la primera página del paginador si está disponible.
     * @param {any} event - Evento que contiene el valor seleccionado en el filtro.
     */
    onSelectionChange(event: any): void {
        const filterValue = event.value;;
        console.log(filterValue)
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Método que se ejecuta cuando se aplica un filtro en el campo de búsqueda.
     * Aplica el filtro a los datos de la tabla según el valor ingresado en el campo de búsqueda,
     * convirtiendo el valor a minúsculas y eliminando los espacios en blanco al principio y al final.
     * Además, navega a la primera página del paginador si está disponible.
     * @param {Event} event - Evento que contiene el valor ingresado en el campo de búsqueda.
     */
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    /**
     * Método para aprobar una transacción.
     * @param {any} element - Elemento que se va a aprobar.
     */
    embargar(embargo) {

        //apertura modal de confirmación
        const confirmation = this._fuseConfirmationService.open({

            "title": "Desea embargar La transacción",
            "message": "Esta seguro de embargar la transacción.",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation-triangle",
                "color": "warn"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "Aceptar",
                    "color": "warn"
                },
                "cancel": {
                    "show": false,
                    "label": "Cancel"
                }
            },
            "dismissible": true
        }
        );


        confirmation.afterClosed().subscribe((result) => {
            if (!result) return

            this.isEnableButton = false;
            const titulosEmbargo = {
                fecTrans: embargo.fecTrans,
                idePer: embargo.idePer,
                valTran: embargo.valTran,
                intencionCompra: embargo.intencionCompra,
                tipoTransaccion: {
                    codTipTran: 1
                },
                estadoTransaccion: {
                    ideEstado: 4
                },
                transaccionTitulo: embargo.transaccionTitulo.map(titulo => ({
                    conseTitulo: titulo.conseTitulo,
                    numAcciones: titulo.numAcciones
                }))
            };

            this.controlTitulosService.embargarTitulo(titulosEmbargo).subscribe(
                {
                    next: (data) => {

                        this.mostrarAlertaExitosa()
                        this.inicializarDatos();
                    },
                    error: (error) => {
                        this.mostrarAlertaFallida()
                    }
                }
            )
        }
        );
    }



    aprobar(aprobar) {
        const { tipoTransaccionN, ...element } = aprobar
        const dialogRef = this.dialog.open(AprobarModalComponent, {
            width: '450px',
            height: '300px',
            data: {
                element
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(item => item.conseTrans !== element.conseTrans);
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida()
            }
        });
    }


    /**
    * Método para rechazar una transacción.
    * @param {any} element - Elemento que se va a rechazar.
    */
    rechazar(rechazar) {
        const { tipoTransaccionN, ...element } = rechazar
        const dialogRef = this.dialog.open(RechazarModalComponent, {
            width: '450px',
            height: '300px',
            data: {
                element
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(item => item.conseTrans !== element.conseTrans);
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida()
            }
        });
    }

    /**
     * Método para recargar el componente redirigiendo a la ruta '/acciones/aprobacion'.
     * Primero redirige a la ruta raíz '/' y luego a la ruta '/acciones/aprobacion'.
     * Pendiente!!
     */
    recargarComponente(): void {
        this.router.navigate(['/']).then(() => {
            this.router.navigate(['/acciones/aprobacion']);
        });
    }
}



