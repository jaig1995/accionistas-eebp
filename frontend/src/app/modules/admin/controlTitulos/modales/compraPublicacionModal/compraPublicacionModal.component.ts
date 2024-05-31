import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlTitulosService } from '../../controlTitulos.service';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-compra-publicacion-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule
    ],
    templateUrl: 'compraPublicacionModal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CompraPublicacionModalComponent implements OnInit {


    //validaciones archivos
    fileName: string = '';
    isValidFile: boolean = false;
    archivoSeleccionado: File | null = null;
    isLoading: boolean = true;

    //seleccionador
    accionistas: any[] = [];

    miFormulario: FormGroup;
    numeroAcciones: any
    datosModal: FormGroup;

    formulario: any
    sumaTotal: any;
    filteredAccionistas: Observable<any[]>;
    consecutivoArchivo: any;

    public tomadoresForm: FormGroup = this.fb.group({
        tomadores: this.fb.array([], [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)])
    });

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<CompraPublicacionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private controlTitulosService: ControlTitulosService,
    ) {
        this.sumaTotal = data.arrayTitulos.reduce((total, transaccion) => total + transaccion.numAcciones, 0);
        this.miFormulario = this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
        });

        this.numeroAcciones = this.fb.group({
            cantAcciones: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/), this.maxNumberValidator(this.sumaTotal)]]
        });
    }



    /**
     * Maneja el evento de selección de archivo.
     * Verifica si el archivo seleccionado es válido (PDF o DOCX).
     * Actualiza el estado de isValidFile y fileName en consecuencia.
     *
     * @param {Event} event - El evento de selección de archivo.
     */
    onFileSelected(event: any) {
        const fileInput = event.target;
        const file = fileInput.files[0];
        const fileExtension = file?.name.split('.').pop();

        if (file && (fileExtension === 'pdf' || fileExtension === 'docx')) {
            this.isValidFile = true;
            this.fileName = file.name;
            this.archivoSeleccionado = file;
        } else {
            this.isValidFile = false;
            this.fileName = 'Archivo no válido';
            this.archivoSeleccionado = null;
        }
    }

    /**
     * Método que cambia el nombre de un archivo seleccionado.
     * @param nuevoNombre El nuevo nombre para el archivo.
     */
    cambiarNombreArchivo(nuevoNombre: string) {
        if (!this.archivoSeleccionado) {
            console.error('No se ha seleccionado ningún archivo.');
            return;
        }

        const fileExtension = this.archivoSeleccionado.name.split('.').pop();
        const nuevoArchivo = new File([this.archivoSeleccionado], nuevoNombre + '.' + fileExtension, {
            type: this.archivoSeleccionado.type,
            lastModified: this.archivoSeleccionado.lastModified
        });

        // Asignar el nuevo archivo a this.archivoSeleccionado
        this.archivoSeleccionado = nuevoArchivo;
    }



    filterAccionistas(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    submit() {
        this.isLoading = false;
        let titulos = this.data.arrayTitulos.map(data => {
            return {
                conseTrans: data.conseTrans,
                conseTitulo: data.conseTitulo,
                numAcciones: data.numAcciones
            }
        }
        )

        let tomadores = this.tomadores.value;
        let numeroAcciones = this.numeroAcciones.value
        let arrayTomadores = tomadores.map(nombre => {
            return { "idePer": nombre };
        });

        let transaccion = {
            ...numeroAcciones,
            titulos,
            tomadores: arrayTomadores

        }
        this.controlTitulosService.comprarTitulo(transaccion).subscribe({
            next: (data) => {
                this.consecutivoArchivo = data.conseTrans;
                const conseTrans = this.consecutivoArchivo;
                let nombreArchivo = `transaccion_${conseTrans}_formatoCompraVenta`;
                this.cambiarNombreArchivo(nombreArchivo);
                this.controlTitulosService.enviarFormatoVenta(this.archivoSeleccionado).subscribe();
                this.dialogRef.close({ success: true });

            },
            error: (error) => {
                this.dialogRef.close({ success: false });
            }
        });
    }



    /**
     * Crea un FormGroup para un objeto dado.
     *
     * @param {any} objeto - El objeto para el cual se creará el FormGroup.
     * @returns {FormGroup} - El FormGroup creado para el objeto.
     */
    crearFormulario(titulo: any): FormGroup {
        return this.fb.group({
            conseTrans: [titulo.conseTrans],
            conseTitulo: [titulo.conseTitulo],
            numAcciones: [titulo.numAcciones],
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

    get tomadores(): FormArray {
        return this.tomadoresForm.get('tomadores') as FormArray;
    }


    displayAccionista(accionista: any): string {
        return accionista && accionista.Nombres ? accionista.Nombres : '';
    }


    /**
     * Agrega un tomador al formulario.
     * Verifica si el formulario es inválido y, en ese caso, retorna.
     * Obtiene el valor del tomador seleccionado en el formulario.
     * Si el valor seleccionado es un objeto, agrega el id del tomador al arreglo de tomadores.
     * Si el valor seleccionado es un número, lo agrega como id del tomador al arreglo de tomadores.
     * Finalmente, reinicia el formulario.
     */
    agregarTomador(): void {
        if (this.miFormulario.invalid) return;

        const selectedAccionista = this.miFormulario.value.nombre;
        if (typeof (selectedAccionista) === 'object') {
            this.tomadores.push(this.fb.control(selectedAccionista.idPer, Validators.required));
        } else {
            if (!/^\d+$/.test(selectedAccionista)) return
            this.tomadores.push(this.fb.control(selectedAccionista, Validators.required));

        }
        this.miFormulario.reset();
    }


    eliminarTomador(index: number): void {
        this.tomadores.removeAt(index);
    }


    /**
    * Genera un validador personalizado para verificar si un número supera el valor máximo de acciones especificado.
    * Si el número supera el valor máximo, devuelve un error indicando que excede el límite.
    *
    * @param {number} max - El valor máximo permitido.
    * @returns Un validador personalizado para verificar el valor máximo.
    */
    maxNumberValidator(max: number) {
        return (control: FormControl): { [key: string]: any } | null => {
            const value = control.value;
            if (isNaN(value) || value <= 0 || value > max) {
                return { 'maxNumber': { value: control.value } };
            }
            return null;
        };
    }
}
