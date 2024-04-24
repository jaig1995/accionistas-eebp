import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPreguntasAsambleaComponent } from './resumenPreguntasAsamblea/resumenPreguntasAsamblea.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemasAsamblea } from './Datos/temasAsamblea';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FuseLoadingService } from '@fuse/services/loading';
import { AsambleaService } from '../asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';

@Component({
    selector: 'app-creacion-plantillas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ResumenPreguntasAsambleaComponent,
        ReactiveFormsModule,
        FuseLoadingBarComponent,
        AngularMaterialModules
    ],
    templateUrl: 'creacionPlantillas.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreacionPlantillasComponent implements OnInit {

    // Inyeccion de dependencias
    private fb = inject(FormBuilder)
    private asambleaService = inject(AsambleaService)

    //stepper
    @ViewChild('stepper') stepper!: MatStepper;
    pasoActual: number

    // alertas y cargas
    showAlert
    loading

    // arrays
    contextoPreguntas: any = [];
    respuestasOpcionMultiple: any = []

    // informacion temas asamblea
    temasAsamblea: any = []
    esEditableTemasAsamblea = false


    // dialogo
    dialogRef: MatDialogRef<any>;


    // formulario Plantilla preguntas
    respuestaOpcionMultiple = new FormControl

    formularioPreguntas = this.fb.group({
        tipoAsamblea: ['', Validators.required],
        temasAsamblea: ['', Validators.required],
    })

    asignacionPregunta = this.fb.group({
        contextoPregunta: ['', Validators.required],
        tipoRespuesta: ['', Validators.required],
        pregunta: ['', Validators.required],
        respuestas: this.fb.array([]),
    });

    // Fin formularios


    //
    consecutivoAsamblea: any;
    preguntasAsamblea: any;
    existePreguntaMultiple: boolean;

    temasAsambleaPrueba = [
        { nombre: 'Junta Directiva', id: 'juntaDirectiva', selected: true },
        { nombre: 'Revisoría Fiscal', id: 'revisoriaFiscal', selected: true },
        { nombre: 'Reforma Estatutos', id: 'reformaEstatutos', selected: false },
        { nombre: 'Estados Financieros', id: 'estadosFinancieros', selected: false },
        { nombre: 'Distribución Utilidades', id: 'distribucionUtilidades', selected: true },
        { nombre: 'Proposiciones y Varios', id: 'proposicionesYVarios', selected: true },

    ];



    constructor(public dialog: MatDialog, private _fuseLoadingService: FuseLoadingService) { }

    ngOnInit(): void {

        //TODO:recibir el consecutivo del backend
        this.consecutivoAsamblea = 25;


        //TODO:si ya esxiste entonces no crear
        if (true) {
            this.esEditableTemasAsamblea = true;

            this.pasoActual = 1;
            const tipoAsambleaPredeterminado = 'Informativa';
            this.temasAsamblea = this.temasAsambleaPrueba

            this.formularioPreguntas = this.fb.group({
                tipoAsamblea: [{ value: tipoAsambleaPredeterminado, disabled: true }, Validators.required],
                temasAsamblea: [{ value: this.temasAsamblea, disabled: true }, Validators.required],
            });
        } else {

            this.pasoActual = 0;
            this.temasAsamblea = TemasAsamblea
        }
    }

maricada

    /**
 * Show the loading bar
 */
    showLoadingBar(): void {
        this._fuseLoadingService.show();
    }

    /**
     * Hide the loading bar
     */
    hideLoadingBar(): void {
        this._fuseLoadingService.hide();
    }


    goToFirstStep(): void {
        this.stepper.previous();
    }


    // seccion agregar y eliminar respuestas de seleccion multiple
    agregarOpcion() {
        const opcion = this.respuestaOpcionMultiple.value;

        if (opcion) {
            this.respuestasOpcionMultiple.push(opcion);
            this.respuestaOpcionMultiple.reset();
        }

        console.log(this.respuestasOpcionMultiple.length >= 2)
    }

    eliminarOpcion(index: number) {
        this.respuestasOpcionMultiple.splice(index, 1);
    }

    // Fin seccion agregar



    // Método para agregar una nueva pregunta al FormArray
    agregarPregunta() {

        const { contextoPregunta, tipoRespuesta, pregunta } = this.asignacionPregunta.value;

        const respuestas = this.respuestasOpcionMultiple
        const pruebas = {
            [contextoPregunta]: {
                tipoRespuesta: tipoRespuesta,
                pregunta: pregunta,
                respuestas: respuestas
            }
        };
        this.preguntasAsamblea = pruebas;
    }



    actualizarRespuesta(nuevoValor: string, indice: number) {
        if (nuevoValor.trim() !== '') {
            this.respuestasOpcionMultiple[indice] = nuevoValor;
            this.existePreguntaMultiple = false
        } else {
            // Mostrar un mensaje de error, lanzar una alerta, etc.
            console.log('El campo no puede estar vacío.');
            // this.respuestasOpcionMultiple[indice] = this.respuestasOpcionMultiple[indice];
            this.existePreguntaMultiple = true
        }
    }

    guardarPreguntas() {

        this.agregarPregunta()

        console.log("Formulario Para enviar :", this.preguntasAsamblea)

    }


    toggleCheckbox(tema: any,) {

        tema.selected = !tema.selected;

        const index = this.temasAsamblea.findIndex(item => item.id === tema.id);
        if (index !== -1) {
            this.temasAsamblea[index].selected = tema.selected;
        }

        this.formularioPreguntas.get('temasAsamblea').patchValue(this.temasAsamblea);
    }

    // validaciones Formularios
    algunaOpcionSeleccionada(): boolean {
        return this.contextoPreguntas.length > 0;
    }

    estaTipoAsambleaSeleccionada(): boolean {
        return this.formularioPreguntas.get('tipoAsamblea').valid;
    }
    // FIN validaciones




    //Seccion Abrir dialogo
    //alerta de dialogo
    abrirDialogo(template: TemplateRef<any>): void {
        this.dialogRef = this.dialog.open(template);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return


        });
    }

    cerrarDialogo() {
        this.dialogRef.close(false);
        this.goToFirstStep()
    }

    aprobarDialogo() {
        this.dialogRef.close(true);
    }


    //Fin seccion
}
