import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPreguntasAsambleaComponent } from './resumenPreguntasAsamblea/resumenPreguntasAsamblea.component';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemasAsamblea } from './Datos/temasAsamblea';

@Component({
    selector: 'app-creacion-plantillas',
    standalone: true,
    imports: [
        CommonModule,
        ResumenPreguntasAsambleaComponent,
        ReactiveFormsModule,
        AngularMaterialModules
    ],
    templateUrl: 'creacionPlantillas.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreacionPlantillasComponent implements OnInit {

    // Inyeccion de dependencias
    private fb = inject(FormBuilder)

    // alertas y cargas
    showAlert
    loading

    // arrays
    contextoPreguntas: any = [];
    respuestasOpcionMultiple: any = []

    // informacion temas asamblea
    temasAsamblea:any = []



    // formulario Plantilla preguntas
    respuestaOpcionMultiple = new FormControl

    formularioPreguntas = this.fb.group({
        tipoAsamblea: ['', Validators.required],
        temasAsamblea: ['', Validators.required],
        preguntas: this.fb.array([])
    })

    asignacionPregunta = this.fb.group({
        contextoPregunta: ['', Validators.required],
        tipoRespuesta: ['', Validators.required],
        pregunta: ['', Validators.required],
        respuestas: ['', Validators.required],
    });
    res: boolean;

    // Fin formularios


    temasAsambleaPrueba = [
        { nombre: 'Junta Directiva', id: 'juntaDirectiva', selected: false },
        { nombre: 'Revisoría Fiscal', id: 'revisoriaFiscal', selected: true },
        { nombre: 'Reforma Estatutos', id: 'reformaEstatutos', selected: false },
        { nombre: 'Estados Financieros', id: 'estadosFinancieros', selected: false  },
        { nombre: 'Distribución Utilidades', id: 'distribucionUtilidades', selected: true  },
        { nombre: 'Proposiciones y Varios', id: 'proposicionesYVarios', selected: true  },

    ];

    ngOnInit(): void {


        if (true) {


            const tipoAsambleaPredeterminado = 'Informativa';
            const temasAsambleaPredeterminado = '';

            this.formularioPreguntas = this.fb.group({
                tipoAsamblea: [tipoAsambleaPredeterminado, Validators.required],
                temasAsamblea: [temasAsambleaPredeterminado, Validators.required],
                preguntas: this.fb.array([]) // Deja el array de preguntas vacío por ahora
            });

            this.temasAsamblea = this.temasAsambleaPrueba
        }else{

            this.temasAsamblea = TemasAsamblea
        }
    }


    // seccion agregar y eliminar respuestas de seleccion multiple
    agregarOpcion() {
        const opcion = this.respuestaOpcionMultiple.value;
        if (opcion) {
            this.respuestasOpcionMultiple.push(opcion);
            this.respuestaOpcionMultiple.reset();
        }

    }

    eliminarOpcion(index: number) {
        this.respuestasOpcionMultiple.splice(index, 1);
    }

    // Fin seccion agregar



    // Método para agregar una nueva pregunta al FormArray
    agregarPregunta() {

        const { contextoPregunta, tipoRespuesta, pregunta } = this.asignacionPregunta.value;
        const respuestas = this.respuestasOpcionMultiple
        if (!contextoPregunta) return
        const preguntaArray = this.formularioPreguntas.get('preguntas') as FormArray;
        preguntaArray.push(this.fb.group({
            [contextoPregunta]: this.fb.group({
                tipoRespuesta: [tipoRespuesta, Validators.required],
                pregunta: [pregunta, Validators.required],
                respuestas: [respuestas, Validators.required]
            })
        }))
    }

    guardarPreguntas() {

        this.agregarPregunta()
        console.log("Formulario Principal", this.formularioPreguntas.value);
        this.formularioPreguntas.reset();
        this.asignacionPregunta.reset();
        this.temasAsamblea = []
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



}
