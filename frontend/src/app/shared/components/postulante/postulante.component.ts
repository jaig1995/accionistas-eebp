import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputAutocompleteComponent } from '../inputAutocomplete/inputAutocomplete.component';
import { SharedComponentsService } from '../sharedComponents.service';
import { Accionista } from '../interfaces/accionista.interface';

@Component({
    selector: 'app-postulante',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputAutocompleteComponent,
        AngularMaterialModules,
    ],
    templateUrl: 'postulante.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class PostulanteComponent implements OnInit {

    // Inyección de dependencias
    private sharedComponentsService = inject(SharedComponentsService)
    private fb = inject(FormBuilder)

    @ViewChild(InputAutocompleteComponent) inputAutocompleteComponent: InputAutocompleteComponent;


    //variables para componentes padres
    @Output() datosDelPostulante = new EventEmitter<any>();
    @Output() campoVacio = new EventEmitter<any>(false);

    //variables de entrada al componente
    @Input() modoUnSoloPostulante = false
    @Input() modoListarPersonas = false

    //Variables Imagenes
    imagenCargada: boolean = false;
    imagenPostulante: string = "../../../../assets/images/avatars/1994190568.jpg";

    //Variables informacion accionistas
    datosAccionista: any
    InformacionDelPostulante: any

    //formulario datos postulante
    datosPostulante: FormGroup;
    validacionDatosAccionista: boolean = false;

    //validacion existen datos de accionista
    existenDatosAccionista: boolean = false;


    ngOnInit(): void {
        this.datosPostulante = this.fb.group({
            tipoAccionista: [this.modoUnSoloPostulante ? 'principal' : '', Validators.required],
            nombresApellidos: ['', Validators.required],
            telefono: ['', Validators.required],
            documentoIdentidad: ['', Validators.required],
            correoElectronico: ['', [Validators.required, Validators.email]]
        });

        this.datosPostulante.valueChanges.subscribe(value => {
            if (this.datosPostulante.invalid || !this.validacionDatosAccionista) return
            this.datosDelPostulante.emit(this.datosPostulante)

        });

    }


    //seccion recibe datos de los componentes hijos
    obtenerDatosAccionista(valor: string) {
        this.datosAccionista = valor;
    }

    errorFormularioDatosAccionista(error) {
        this.validacionDatosAccionista = error;
        this.campoVacio.emit(this.validacionDatosAccionista)
        if (!this.validacionDatosAccionista) {
            this.datosPostulante.reset()
        }
    }
    //fin seccion



    /**
     * Método utilizado para buscar un accionista y obtener sus datos.
     * Marca el campo de tipo de accionista como tocado si no se proporcionan datos de accionista.
     * Obtiene los datos del postulante utilizando el código del accionista.
     * Reinicia los datos del accionista después de obtener los datos del postulante.
     */
    buscarAccionista() {
        if (!this.datosAccionista) {
            this.datosPostulante.get('tipoAccionista').markAsTouched();
            return
        }
        const { idPer: codigoDelAccionista } = this.datosAccionista
        this.obtenerDatosPostulante(codigoDelAccionista)
        this.enviarPostulante()
        this.datosAccionista = undefined
    }


    /**
     * Obtiene los datos correspondientes al accionista postulado
     * @param codigoDelAccionista cedula accionista
     */
    obtenerDatosPostulante(codigoDelAccionista) {
        this.sharedComponentsService.obtenerInformacionAccionista(codigoDelAccionista)
            .subscribe({
                next: (data: Accionista) => {
                    console.log('💻🔥 114, postulante.component.ts: ', data);
                    this.InformacionDelPostulante = data
                    this.datosPostulante.patchValue({
                        nombresApellidos: data.nomPri,
                        telefono: data.celPersona,
                        documentoIdentidad: data.codUsuario,
                        correoElectronico: data.correoPersona
                    });
                    this.datosPostulante.get('tipoAccionista').markAsTouched();
                },
                error: (data) => {
                    this.existenDatosAccionista = true
                },

            })
    }

    /**
     * Método utilizado para enviar los datos del postulante.
     * Emite los datos del postulante para que otros componentes los reciban.
     */
    enviarPostulante() {
        this.datosDelPostulante.emit(this.datosPostulante)
    }

    /**
     * Método utilizado para borrar los formularios.
     * tanto el componente hijo como el formulario del padre.
     */
    borrarFormulario() {
        this.datosPostulante.reset()
        this.inputAutocompleteComponent.borrarFormulario()
    }

}



