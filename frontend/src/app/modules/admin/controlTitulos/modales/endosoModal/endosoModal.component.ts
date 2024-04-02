import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { VentaModalComponent } from '../ventaModal/ventaModal.component';
import { ControlTitulosService } from '../../controlTitulos.service';

@Component({
    selector: 'app-endoso-modal',
    standalone: true,
    imports: [
        CommonModule,
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: 'endosoModal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndosoModalComponent {

    //usuario
    idPersona: string

    //formularios
    formulario: any
    descripcion: any

    //validaciones archivos
    fileName: string = '';
    isValidFile: boolean = false;
    archivoSeleccionado: File | null = null;
    isLoading: boolean = true


    constructor(public dialogRef: MatDialogRef<VentaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, private controlTitulosService: ControlTitulosService) {
    }



    ngOnInit(): void {
        const { codigo } = this.data
        this.idPersona = codigo
        // incializacion formularios
        const formArray = this.formBuilder.array(this.data.titulo.map(objeto => this.crearFormulario(objeto)));
        this.formulario = this.formBuilder.group({
            titulos: formArray
        });

        this.descripcion = this.formBuilder.group({
            obsTransaccion: ['', Validators.required]
        });
    }


    /**
     * Crea un FormGroup para un objeto dado.
     *
     * @param {any} objeto - El objeto para el cual se creará el FormGroup.
     * @returns {FormGroup} - El FormGroup creado para el objeto.
     */
    crearFormulario(objeto: any): FormGroup {
        const maxAllowed = objeto.canAccTit;
        return this.formBuilder.group({
            conseTitulo: [objeto.conseTitulo],
            numAcciones: [objeto.canAccTit, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/), this.maxNumberValidator(maxAllowed)]],
            valAccTit: [objeto.valAccTit],
        });
    }



    /**
     * Maneja el evento para enviar el formulario
     */
    onSubmit() {
        this.isLoading = false
        const descripcionEndoso = this.descripcion.value;
        const transaccionTituloSinValAccTit = this.formulario.value.titulos.map(titulo => {
            const { valAccTit, ...rest } = titulo;
            return rest;
        });
        const enviar = {
            fecTrans: this.obtenerFechaActual(),
            idePer: this.idPersona,
            valTran: 1000,
            intencionCompra: false,
            ...descripcionEndoso,
            tipoTransaccion: {
                codTipTran: 4
            },
            transaccionTitulo: transaccionTituloSinValAccTit
        }
        this.controlTitulosService.enviarTransaccion(enviar)
            .subscribe({
                next: (data) => {
                    const conseTrans = data;
                    let nombreArchivo = `transaccion_${conseTrans}_formatoEndoso`
                    this.cambiarNombreArchivo(nombreArchivo)
                    // petición enviar documento
                    this.controlTitulosService.enviarFormatoVenta(this.archivoSeleccionado).subscribe(
                        {
                            error: (data) => {
                                this.dialogRef.close({ success: false });
                            }
                        }
                    )
                    this.dialogRef.close({ success: true });
                },
                error: (data) => {
                    this.dialogRef.close({ success: false });
                }
            });
    }


    /**
     * Formatea la hora al formato especificado AAAA-MM-DD.
     */
    obtenerFechaActual() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        const fechaFormateada = `${year}-${month}-${day}`;
        return fechaFormateada;
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


    cambiarNombreArchivo(nuevoNombre: string) {
        if (!this.archivoSeleccionado) return;
        const fileExtension = this.archivoSeleccionado.name.split('.').pop();
        const nuevoArchivo = new File([this.archivoSeleccionado], nuevoNombre + '.' + fileExtension, {
            type: this.archivoSeleccionado.type,
            lastModified: this.archivoSeleccionado.lastModified
        });
        this.archivoSeleccionado = nuevoArchivo;
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
