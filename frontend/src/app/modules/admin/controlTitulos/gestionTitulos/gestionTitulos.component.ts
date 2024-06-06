import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ControlTitulosService } from '../controlTitulos.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FuseLoadingService } from '@fuse/services/loading';
import { fuseAnimations } from '@fuse/animations';

import { VentaModalComponent } from '../modales/ventaModal/ventaModal.component';
import { EndosoModalComponent } from '../modales/endosoModal/endosoModal.component';
import { DonacionModalComponent } from '../modales/donacionModal/donacionModal.component';
import { EmbargoModalComponent } from '../modales/embargoModal/embargoModal.component';
import { SucesionModalComponent } from '../modales/sucesionModal/sucesionModal.component';
import { EditarTituloModalComponent } from '../modales/editarTituloModal/editarTituloModal.component';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-gestion-titulos',
    templateUrl: './getionTitulos.component.html',
    styleUrls: ['./gestionTitulos.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        FuseAlertComponent,
        MatAutocompleteModule,
        AsyncPipe,
    ],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GestionTitulosComponent implements OnInit {

    // propiedades
    titulos: any = [];
    datosUsuario: string;
    myControl = new FormControl('');

    filteredAccionistas: Observable<any[]>;


    // tabla
    displayedColumns: string[] = ['select', 'conseTitulo', 'folio', 'canAccTit', 'valor', 'actions'];
    transacciones: any[] = [];


    //Formularios
    formularioBuscar = new FormGroup({
        numeroIdentificacion: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)])
    });

    //spinner, alertas
    showSuccesAlert = false;
    showFailedAlert = false;
    loading = false;
    codigoUsuario: any;
    consecutivosTitulos: any[];
    accionistas: any[] = [];


    miFormulario: FormGroup;


    constructor(private fb: FormBuilder, private controlTitulosService: ControlTitulosService, private dialog: MatDialog, private _fuseLoadingService: FuseLoadingService) {
        this.miFormulario = this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
        });
    }


    ngOnInit(): void {
        this.miFormulario = this.fb.group({
            nombre: [''],
        });

        this.controlTitulosService.obtenerAccionistasHabilitados().subscribe(data => {
            this.accionistas = data;
        });

        this.filteredAccionistas = this.miFormulario.get('nombre').valueChanges.pipe(
            startWith(''),
            map(value => this._filterAccionistas(value))
        );

    }


    private _filterAccionistas(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    displayAccionista(accionista: any): string {
        return accionista && accionista.Nombres ? accionista.Nombres : '';
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
     * Método para cargar los datos del título con el código especificado.
     * @param {string} cod - El código del título a cargar.
     */
    consultar(): void {
        let num = ''
        const selectedAccionista = this.miFormulario.value.nombre;
        if (typeof (selectedAccionista) === 'object') {
            num = this.miFormulario.value.nombre.idPer
        } else {
            num = this.miFormulario.value.nombre
        }
        this.inicializarDatos(num)
    }


    /**
     * Método para cargar los datos del título con el código especificado.
     * @param {string} cod - El código del título a cargar.
     */
    inicializarDatos(cod): void {
        try {
            this.loading = true
            this.controlTitulosService.obtenerTitulo(cod).subscribe({
                next: (data) => {
                    const { codUsuario, titulos, ...otrosDatos } = data;
                    this.codigoUsuario = codUsuario
                    // filtro en frontend titulos con estado solo activos
                    const titulosActivos = titulos.filter(titulo => titulo.estadoTitulo === "activo" || titulo.estadoTitulo === "En tramite");
                    this.titulos = titulosActivos.map(titulo => ({
                        ...titulo,
                        selected: false //propiedad para seleccionador
                    }));
                    this.obtenerNombreCompleto(otrosDatos);
                    this.loading = false
                },
                error: (data) => {
                    this.loading = false;
                    this.titulos = [];
                }
            });

        } catch (error) {
            this.loading = false
            this.titulos = [];
        }
    }

    /**
     * Método para obtener el nombre completo a partir de un objeto con nombres.
     * @param {any} nombres - Objeto que contiene los nombres a concatenar.
     * @returns {string} El nombre completo concatenado.
     */
    obtenerNombreCompleto(nombres: any): string {
        if (!nombres) return
        this.datosUsuario = `${nombres.nomPri} ${nombres.nomSeg} ${nombres.apePri} ${nombres.apeSeg}`;
    }


    /**
     * Método para seleccionar o deseleccionar todos los elementos de la lista.
     * @param {any} event - Evento que indica si la selección maestra está activada o desactivada.
     */
    masterToggle(event: any): void {
        if (event.checked) {
            this.titulos.forEach(row => {
                row.selected = true;
                this.addTotransacciones(row);
            });
        } else {
            this.transacciones = [];
            this.titulos.forEach(row => row.selected = false);
        }
    }

    /**
     * Método para agregar un elemento a la lista de elementos seleccionados.
     * @param {any} row - Elemento que se va a agregar a la lista de elementos seleccionados.
     */
    addTotransacciones(row: any): void {
        if (!this.transacciones.includes(row)) {
            this.transacciones.push(row);
        }
        this.consecutivosTitulos = this.transacciones.map(titulo => titulo.conseTitulo);
    }


    /**
     * Método para alternar la selección de un elemento de la lista.
     * @param {any} row - Elemento cuya selección se va a alternar.
     */
    toggleRow(row: any): void {
        row.selected = !row.selected;
        if (row.selected) {
            this.addTotransacciones(row);
        } else {
            this.transacciones = this.transacciones.filter(selectedRow => selectedRow !== row);
        }
    }



    /**
     * Abre un diálogo modal para realizar una venta de títulos.
     * Si se proporciona un elemento, se utiliza ese elemento para la venta.
     * Si no se proporciona un elemento, se utilizan todas las transacciones disponibles.
     * Después de cerrar el diálogo modal, actualiza la lista de títulos y muestra una alerta exitosa o fallida según el resultado.
     * @param element (Opcional) proviene desde el html con la row seleccionada desde el boton
     */
    ventaModal(element?: any): void {
        if (element) {
            var transacciones = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var transacciones = this.transacciones
        }
        const codigo = this.codigoUsuario
        //modal
        const dialogRef = this.dialog.open(VentaModalComponent, {
            width: '700px',
            height: '620px',
            data: {
                titulo: transacciones,
                codigo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.titulos = this.titulos.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }

    /**
    * Abre un diálogo modal para realizar un ENDOSO de títulos.
    * Si se proporciona un elemento, se utiliza ese elemento para la venta.
    * Si no se proporciona un elemento, se utilizan todas las transacciones disponibles.
    * Después de cerrar el diálogo modal, actualiza la lista de títulos y muestra una alerta exitosa o fallida según el resultado.
    * @param element (Opcional) proviene desde el html con la row seleccionada desde el boton
    */
    endosoModal(element: any): void {
        if (element) {
            var transacciones = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var transacciones = this.transacciones
        }
        const codigo = this.codigoUsuario
        //modal
        const dialogRef = this.dialog.open(EndosoModalComponent, {
            width: '700px',
            height: '620px',
            data: {
                titulo: transacciones,
                codigo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.titulos = this.titulos.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }


    /**
    * Abre un diálogo modal para realizar una DONACIÓN de títulos.
    * Si se proporciona un elemento, se utiliza ese elemento para la venta.
    * Si no se proporciona un elemento, se utilizan todas las transacciones disponibles.
    * Después de cerrar el diálogo modal, actualiza la lista de títulos y muestra una alerta exitosa o fallida según el resultado.
    * @param element (Opcional) proviene desde el html con la row seleccionada desde el boton
    */
    donacionModal(element: any): void {
        if (element) {
            var transacciones = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var transacciones = this.transacciones
        }
        const codigo = this.codigoUsuario
        //modal
        const dialogRef = this.dialog.open(DonacionModalComponent, {
            width: '700px',
            height: '620px',
            data: {
                titulo: transacciones,
                codigo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.titulos = this.titulos.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }


    /**
    * Abre un diálogo modal para realizar un EMBARGO de títulos.
    * Si se proporciona un elemento, se utiliza ese elemento para la venta.
    * Si no se proporciona un elemento, se utilizan todas las transacciones disponibles.
    * Después de cerrar el diálogo modal, actualiza la lista de títulos y muestra una alerta exitosa o fallida según el resultado.
    * @param element (Opcional) proviene desde el html con la row seleccionada desde el boton
    */
    embargoModal(element: any): void {
        if (element) {
            var transacciones = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var transacciones = this.transacciones
        }
        const codigo = this.codigoUsuario
        //modal
        const dialogRef = this.dialog.open(EmbargoModalComponent, {
            width: '700px',
            height: '480px',
            data: {
                titulo: transacciones,
                codigo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.titulos = this.titulos.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }


    /**
    * Abre un diálogo modal para realizar un SUSECIÓN de títulos.
    * Si se proporciona un elemento, se utiliza ese elemento para la venta.
    * Si no se proporciona un elemento, se utilizan todas las transacciones disponibles.
    * Después de cerrar el diálogo modal, actualiza la lista de títulos y muestra una alerta exitosa o fallida según el resultado.
    * @param element (Opcional) proviene desde el html con la row seleccionada desde el boton
    */
    sucesionModal(element: any): void {
        if (element) {
            var transacciones = [element];
            this.consecutivosTitulos = [element.conseTitulo]
        } else {
            var transacciones = this.transacciones
        }
        const codigo = this.codigoUsuario
        //modal
        const dialogRef = this.dialog.open(SucesionModalComponent, {
            width: '700px',
            height: '620px',
            data: {
                titulo: transacciones,
                codigo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.titulos = this.titulos.filter(titulo => !this.consecutivosTitulos.includes(titulo.conseTitulo));
                this.transacciones = []
                this.consecutivosTitulos = []
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }

    editarModal(titulo) {
        const { editarTitulo } = titulo
        const dialogRef = this.dialog.open(EditarTituloModalComponent, {
            width: '700px',
            height: '480px',
            data: {
                editarTitulo
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.inicializarDatos(this.formularioBuscar.value.numeroIdentificacion)
                this.mostrarAlertaExitosa()
            } else {
                this.mostrarAlertaFallida
            }
        });
    }


    descargarTitulo(datos: any) {
        this.controlTitulosService.descargarTitulo(datos.conseTitulo).subscribe({
            next: (data) => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Titulo_${datos.conseTitulo}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                console.error('Error al descargar el archivo:', error);
            }
        })
    }




}
