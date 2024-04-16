import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

import { ControlTitulosService } from '../controlTitulos.service';
import { DonarPublicacionModalComponent } from '../modales/donarPublicacionModal/donarPublicacionModal.component';
import { EndosarPublicacionModalComponent } from '../modales/endosarPublicacionModal/endosarPublicacionModal.component';
import { SucesionPublicacionModalComponent } from '../modales/sucesionPublicacionModal/sucesionPublicacionModal.component';
import { CompraPublicacionModalComponent } from '../modales/compraPublicacionModal/compraPublicacionModal.component';
import { Datos } from '../interfaces/publicacionVentas.interface';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
@Component({
    selector: 'app-publicacion-ventas',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FuseAlertComponent,
        InputAutocompleteComponent,
        AngularMaterialModules
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


    //Filtro
    accionesBuscar: number
    //seleccionador de titulos.
    transacciones: any[] = [];
    tipoTransaccionSeleccionado: string | undefined;
    elementoEnTransacciones: boolean = false;

    //alertas, comportamientos validaciones html.
    loading = false;
    showSuccesAlert = false;
    showFailedAlert = false;
    consecutivosTitulos: any[];

    accionistaAutoComplete: any;

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
    applyFilter(event): void {
        const filterValue = event
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ///INCIO SECCION COMPONENTE HIJO
    obtenerAccionista(valor) {
        this.accionistaAutoComplete = valor.idPer;
        console.log(this.accionistaAutoComplete)
        this.applyFilter(this.accionistaAutoComplete)
    }
    //fin seccion

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
            } else {
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
            } else {
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
            } else {
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
            } else {
                this.mostrarAlertaFallida()
            }
        });
    }


    /**
     * Método que busca una combinación de objetos para alcanzar un total específico.
     * Si no puede encontrar una combinación exacta, busca la combinación que tenga la menor diferencia positiva respecto al total.
     * @param total El total que se desea alcanzar con la combinación de objetos.
     * @param desTran El tipo de transacción que deben tener los objetos para ser considerados en la combinación.
     * @param datos Un array de objetos de tipo Datos que se utilizarán para buscar la combinación.
     * @returns Un array de objetos de tipo Datos que representan la combinación encontrada, o null si no se encontró ninguna combinación.
     */
    encontrarCombinacionParaTotal(total: number, desTran: string, datos: Datos[]): Datos[] | null {
        let combinacionExacta: Datos[] | null = null;
        let mejorCombinacion: Datos[] | null = null;
        let diferenciaMejorCombinacion = Infinity;
        let iteraciones = 0;

        function buscarCombinaciones(index: number, combinacionActual: Datos[], sumaParcial: number) {
            iteraciones++;

            if (iteraciones > datos.length * 10) {
                // Detener la recursión si se supera el límite de iteraciones
                return;
            }
            const diferencia = sumaParcial - total;

            if (sumaParcial === total) {
                // Si encuentra una combinación exacta, asignarla y finalizar la búsqueda
                combinacionExacta = [...combinacionActual];
                return;
            }

            if (diferencia >= 0 && diferencia < diferenciaMejorCombinacion) {
                // Actualizar la mejor combinación si la diferencia es menor
                mejorCombinacion = [...combinacionActual];
                diferenciaMejorCombinacion = diferencia;
            }

            for (let i = index; i < datos.length; i++) {
                const dato = datos[i];
                if (!dato.selected && dato.desTran === desTran) {
                    dato.selected = true;
                    combinacionActual.push(dato);
                    buscarCombinaciones(i + 1, combinacionActual, sumaParcial + dato.numAcciones);
                    combinacionActual.pop();
                    dato.selected = false;
                }
            }
        }

        buscarCombinaciones(0, [], 0);
        if (combinacionExacta !== null) {
            return combinacionExacta;
        } else {
            return mejorCombinacion;
        }
    }


    /**
     * Método que busca acciones según un tipo específico y actualiza los datos mostrados en la tabla.
     * Si no se especifica un tipo, se muestran todas las acciones.
     * @param tipo El tipo de transacción por el cual se desea filtrar las acciones.
     */
    buscarAccionesPor(tipo?: string) {
        if (!tipo) {
            this.dataSource.data = this.datosTabla
        } else {
            this.loading = true;
            let numeroAccionesaBuscar = this.accionesBuscar
            const datosAcciones = this.datosTabla
            let filtroAcciones = this.encontrarCombinacionParaTotal(numeroAccionesaBuscar, tipo, datosAcciones);
            this.dataSource.data = filtroAcciones
            tipo = null
            this.loading = false;
        }

        this.accionesBuscar = null
    }

}

