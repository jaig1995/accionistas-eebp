import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlTitulosService } from '../../controlTitulos.service';
import { VentaModalComponent } from '../ventaModal/ventaModal.component';

@Component({
    selector: 'app-rechazar-modal',
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
    templateUrl: 'rechazarModal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazarModalComponent {
    //usuario
    idPersona: string
    //formulario
    formulario: any

    //validaciones archivos
    fileName: string = '';
    isValidFile: boolean = false;
    isLoad: boolean =false



    constructor(public dialogRef: MatDialogRef<VentaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, private controlTitulosService: ControlTitulosService) { }



    ngOnInit(): void {


        const { titulo, codigo } = this.data
        this.idPersona = codigo
        const formArray = this.formBuilder.array(this.data.titulo.map(objeto => this.crearFormulario(objeto)));
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

        const { estadoTransaccion, files, ...rest } = element;
        const aprobacion = {
            ...rest,
            "estadoTransaccion": {
                "ideEstado": 3
            }
        }

        this.controlTitulosService.aprobarTransaccion(aprobacion).subscribe({
            next: (data) => {
                this.isLoad= false;
                this.dialogRef.close({ success: true });
            },
            error: (error) => {
                this.isLoad= false;
                this.dialogRef.close({ success: false });
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
    archivoSeleccionado: File | null = null;

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
            // this.controlTitulosService.enviarFormatoVenta(this.archivoSeleccionado).subscribe(data=>console.log(data))
        } else {
            this.isValidFile = false;
            this.fileName = 'Archivo no válido';
            this.archivoSeleccionado = null;
        }
    }


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
