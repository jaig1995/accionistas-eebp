import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule, } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ControlTitulosService } from '../controlTitulos.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DonarPublicacionModalComponent } from '../modales/donarPublicacionModal/donarPublicacionModal.component';
import { EndosarPublicacionModalComponent } from '../modales/endosarPublicacionModal/endosarPublicacionModal.component';
import { SucesionPublicacionModalComponent } from '../modales/sucesionPublicacionModal/sucesionPublicacionModal.component';
import { fuseAnimations } from '@fuse/animations';
import { CompraPublicacionModalComponent } from '../modales/compraPublicacionModal/compraPublicacionModal.component';
@Component({
    selector: 'app-publicacion-ventas',
    standalone: true,
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
        MatSortModule,
        MatProgressSpinnerModule
    ],
    templateUrl: 'publicacionVentas.component.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class PublicacionVentasComponent implements OnInit, AfterViewInit {

    //Tabla
    displayedColumns: string[] = ['SELECT', 'TIPO', 'IDENTIFICACION', 'TITULO', 'CANTIDADACCION', 'INTENCION', 'ESTADO', 'TRANSACCION',];
    datosTabla: any[] = [];
    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    //seleccionador de titulos.
    transacciones: any[] = [];
    tipoTransaccionSeleccionado: string | undefined;
    elementoEnTransacciones: boolean = false;

    //alertas, comportamientos validaciones html.
    loading = false;
    showSuccesAlert = false;
    showFailedAlert = false;
    consecutivosTitulos: any[];

    constructor(private controlTitulosService: ControlTitulosService, private dialog: MatDialog, private elRef: ElementRef) {
    }


    ngOnInit(): void {
        this.inicializarDatos()

    }



    ngAfterViewInit(): void {
        this.inicializarDatos()

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
     * Método inicializa la tabla obteniedo los datos del service asi mismo,
     * Filtra los datos de la tabla segun la estrucutra del json que se necesita
     * devuelve el array filtrado de los datos por los titulos que esten en tipo {activo}
     */
    async inicializarDatos(): Promise<void> {
        try {
            this.loading = true;
            this.controlTitulosService.obtenerTransaccionesAprobadas().subscribe(titulos => {
                //titulosPorTransaccion contiene todos los titulos estructurados a la tabla de material sin filtrar
                const titulosPorTransaccion = titulos.flatMap(obj => {
                    if (obj.transaccionTitulo.length === 0) {
                        return [];
                    } else {
                        return obj.transaccionTitulo.map(titulo => ({
                            idePer: obj.idePer,
                            intencionCompra: obj.intencionCompra,
                            desTran: obj.tipoTransaccion.desTran,
                            ideEstado: obj.estadoTransaccion.ideEstado,
                            descEstado: obj.estadoTransaccion.descEstado,
                            conseTrans: obj.conseTrans,
                            conseTitulo: titulo.conseTitulo,
                            numAcciones: titulo.numAcciones,
                            descEstadoTitulo: titulo.descEstado,
                            selected: false //se agrega para el seleccionador en html
                        }));
                    }

                }

                );
                this.loading = false
                //mostrar solo titulos activos filtro en Front-end por estado diferentes de anulado
                let titulosActivos = titulosPorTransaccion.filter(activo => activo.descEstadoTitulo !== 'anulado')
                //asignación a tabla de material
                this.datosTabla = titulosActivos
                // console.log(this.datosTabla) //TODO:empezar aqui funcionalidad filtro avanzado
                this.dataSource = new MatTableDataSource<any>(this.datosTabla);
                //inicialización de paginador
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
        } catch (error) {
            this.datosTabla = [];
        }
    }



    /**
     * Método para alternar la selección de un elemento de la lista.
     * @param {any} row - Elemento cuya selección se va a alternar.
     */
    toggleRow(row: any): void {
        this.tipoTransaccionSeleccionado = row.desTran
        row.selected = !row.selected;
        if (row.selected) {
            this.addTotransacciones(row);
        } else {
            this.transacciones = this.transacciones.filter(selectedRow => selectedRow !== row);
        }
    }


    /**
     * Método para agregar un elemento a la lista de elementos seleccionados.
     * @param {any} row - Elemento que se va a agregar a la lista de elementos seleccionados.
     */
    addTotransacciones(row: any): void {
        if (this.transacciones.length > 0) {
            if (this.tipoTransaccionSeleccionado !== row.desTran) {
                this.tipoTransaccionSeleccionado = row.desTran;
                this.elementoEnTransacciones = true
                return;
            }
        } else {
            this.tipoTransaccionSeleccionado = row.desTran;
        }
        if (!this.transacciones.includes(row)) {
            this.transacciones.push(row);
            this.consecutivosTitulos = this.transacciones.map(titulo => titulo.conseTitulo);
        }
    }


    /**
     * Método que aplica un filtro de búsqueda a los datos de la tabla.
     * @param event El evento que desencadena la aplicación del filtro.
    */
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /**
     * Método que se ejecuta cuando cambia la selección en un control, como un menú desplegable.
     * Aplica un filtro a los datos de la tabla según el valor seleccionado en el control.
     * @param event El evento que desencadena el cambio de selección.
     */
    onSelectionChange(event: any) {
        const filterValue = event.value;
        this.dataSource.filter = filterValue.trim();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }

    }


    /**
     * Método que abre un diálogo modal para realizar una compra de publicación.
     * este metodo se usa para compra individual como para compra por seleccionador multiple
     * @param element (Opcional) titulo desde el html.
     */
    compraModal(element?: any): void {
        // Se define un array de títulos, que puede contener un solo elemento (si se pasa un elemento) o todos los elementos de transacciones.
        if (element) {
            var arrayTitulos = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var arrayTitulos = this.transacciones
        }

        //modal
        const dialogRef = this.dialog.open(CompraPublicacionModalComponent, {
            width: '600px',
            height: '620px',
            data: {
                arrayTitulos,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            }else{
                this.mostrarAlertaFallida()
            }
        });
    }


    /**
     * Método que abre un diálogo modal para realizar un endoso de publicación.
     * este metodo se usa para endoso individual como para endoso por seleccionador multiple
     * @param element (Opcional) titulo desde el html.
     */
    endosarModal(element?: any): void {
        // Se define un array de títulos, que puede contener un solo elemento (si se pasa un elemento) o todos los elementos de transacciones.
        if (element) {
            var arrayTitulos = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var arrayTitulos = this.transacciones
        }
        //modal
        const dialogRef = this.dialog.open(EndosarPublicacionModalComponent, {
            width: '600px',
            height: '620px',
            data: {
                arrayTitulos,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            }else{
                this.mostrarAlertaFallida()
            }
        });
    }


    /**
     * Método que abre un diálogo modal para realizar una donación de publicación.
     * este metodo se usa para una donación individual como para donaciones por seleccionador multiple
     * @param element (Opcional) titulo desde el html.
     */
    donarModal(element?: any): void {
        // Se define un array de títulos, que puede contener un solo elemento (si se pasa un elemento) o todos los elementos de transacciones.
        if (element) {
            var arrayTitulos = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var arrayTitulos = this.transacciones
        }
        //modal
        const dialogRef = this.dialog.open(DonarPublicacionModalComponent, {
            width: '600px',
            height: '620px',
            data: {
                arrayTitulos,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            }else{
                this.mostrarAlertaFallida
            }
        });
    }


    /**
     * Método que abre un diálogo modal para realizar una sucesión de publicación.
     * este metodo se usa para una sucesión individual como para sucesiones por seleccionador multiple
     * @param element (Opcional) titulo desde el html.
     */
    sucesionModal(element?: any): void {
        // Se define un array de títulos, que puede contener un solo elemento (si se pasa un elemento) o todos los elementos de transacciones.
        if (element) {
            var arrayTitulos = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var arrayTitulos = this.transacciones
        }

        //modal
        const dialogRef = this.dialog.open(SucesionPublicacionModalComponent, {
            width: '600px',
            height: '620px',
            data: {
                arrayTitulos,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.dataSource.data = this.dataSource.data.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            }else{
                this.mostrarAlertaFallida()
            }
        });
    }
}
