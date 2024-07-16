import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlTitulosService } from '../../controlTitulos.service';
import { VentaModalComponent } from '../ventaModal/ventaModal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-aprobar-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        MatButtonModule,
        ReactiveFormsModule

    ],
    templateUrl: 'aprobarModal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AprobarModalComponent {
    //usuario
    idPersona: string
    //formulario
    formulario: any

    //validaciones archivos
    fileName: string = '';
    isValidFile: boolean = false;
    isLoad: boolean =false

    //alertas
    showSuccesAlert = false;
    showFailedAlert = false;

    archivoSeleccionado: File | null = null;


    constructor(public dialogRef: MatDialogRef<VentaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, private controlTitulosService: ControlTitulosService) { }

    ngOnInit(): void {
        console.log('💻🔥 52, aprobarModal.component.ts: ', this.data.nombreArchivo);
        const { titulo, codigo } = this.data
        this.idPersona = codigo
        const formArray = titulo ? this.formBuilder.array(titulo.map(objeto => this.crearFormulario(objeto))) : this.formBuilder.array([]);
        this.formulario = this.formBuilder.group({
            titulos: formArray
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
        this.isLoad= true;
        let element = this.data.element
        let tipo = this.data.tipo

        const { estadoTransaccion, files, ...rest } = element;
        const aprobacion = {
            ...rest,
            estadoTransaccion: tipo
        }
        const nombreArchivo = `transaccion_${element.conseTrans}_${this.data.nombreArchivo}`
        this.cambiarNombreArchivo(nombreArchivo)
        console.log('💻🔥 93, aprobarModal.component.ts: ', this.archivoSeleccionado);
        this.controlTitulosService.aprobarTransaccion(aprobacion).subscribe({
            next:(data)=>{
                this.isLoad= false;

                this.controlTitulosService.enviarFormatosAprobados(this.archivoSeleccionado).subscribe({
                    next:(data)=>{
                        console.log('Enviado Con exito ', data);
                        this.dialogRef.close({ success: true })
                    },
                    error:(err)=>{
                        console.error("No se pudo completar el envio del archivo" , err);
                    }
                })
            },
            error:(error)=>{
                this.isLoad= false;
                this.dialogRef.close({ success: false })

            }
        }
        )
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
        console.log('💻🔥 150, aprobarModal.component.ts: ', this.archivoSeleccionado);
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


    /**
    * Genera un validador personalizado para verificar si un número supera el valor máximo de acciones especificado.
    * Si el número supera el valor máximo, devuelve un error indicando que excede el límite.
    *
    * @param {number} max - El valor máximo permitido.
    * @returns Un validador personalizado para verificar el valor máximo.
    */
    maxNumberValidator(max: number) {
        return (control: FormControl) => {
            const value = control.value;
            const maxAllowed = max;
            if (value > maxAllowed) {
                return { maxNumber: true };
            }
            return null;
        };
    }
}
