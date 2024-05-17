import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea.service';

@Component({
    selector: 'app-resultado-votacion',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules
    ],
    templateUrl: 'resultadoVotacion.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ResultadoVotacionComponent implements OnInit {

    //inyeccion de dependencias
    private _asambleaService = inject(AsambleaService);

    resultadosVotacion:any

    ngOnInit(): void {
        this.obtenerResultados()
        // this.resultadosVotacion = data
    }

    obtenerResultados() {
        this._asambleaService.obtenerResultadosVotaciones(15).subscribe({
            next:(data)=>{
                this.resultadosVotacion = data;
                console.log(data.length)
            },
            error:(error)=>{
                console.log(error)
            }
        })
    }
}


export const data = [
    {
        "idPregunta": 22,
        "pregunta": "¿Cómo evalúan la facilidad de uso y la experiencia general del usuario final con el sistema en situaciones de alta carga? Por favor, incluyan ejemplos específicos de tareas críticas y las dificultades que los usuarios pueden haber encontrado.",
        "opciones": [
            {
                "idOpcion": 50,
                "opcion": "Si",
                "numVotos": 48
            },
            {
                "idOpcion": 51,
                "opcion": "no",
                "numVotos": 66
            },
            {
                "idOpcion": 52,
                "opcion": "talvez",
                "numVotos": 10
            }
        ]
    },
    {
        "idPregunta": 22,
        "pregunta": "¿Esta funcionando?",
        "opciones": [
            {
                "idOpcion": 50,
                "opcion": "Qué estrategias se han considerado o implementado para garantizar que el sistema pueda escalar eficazmente con el crecimiento de la demanda? Nos interesa conocer los planes a corto y largo plazo para la escalabilidad y las pruebas que se han realizado para validar estas estrategias",
                "numVotos": 400
            },
            {
                "idOpcion": 51,
                "opcion": "Qué tipo de documentación se proporciona para los usuarios finales y el equipo de soporte técnico? Nos gustaría entender la profundidad y claridad de la documentación, así como los recursos disponibles para la capacitación.",
                "numVotos": 0
            },
            {
                "idOpcion": 52,
                "opcion": "Cómo se gestionan las incidencias reportadas durante las pruebas? Por favor, describan el flujo completo desde la detección de un problema hasta su resolución, incluyendo los roles y responsabilidades de los involucrados en el proceso.",
                "numVotos": 1
            }
        ]
    }
]
