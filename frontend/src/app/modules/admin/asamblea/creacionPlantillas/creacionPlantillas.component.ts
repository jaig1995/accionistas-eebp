import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPreguntasAsambleaComponent } from './resumenPreguntasAsamblea/resumenPreguntasAsamblea.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-creacion-plantillas',
    standalone: true,
    imports: [
        CommonModule,
        ResumenPreguntasAsambleaComponent,
        ReactiveFormsModule,
        AngularMaterialModules
    ],
    templateUrl:'creacionPlantillas.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreacionPlantillasComponent {

    contextoPreguntas: string[] = []; // Array para almacenar los valores seleccionados de los checkboxes
    temaSeleccionado: string;


    selectedOptionControl = new FormControl('');

    showAlert
    loading


    toggleCheckbox(tema: string) {
        // Verificar si el tema ya está en el array de contextoPreguntas
        const index = this.contextoPreguntas.indexOf(tema);

        // Si el tema está seleccionado, lo quitamos del array; si no, lo añadimos
        if (index === -1) {
          this.contextoPreguntas.push(tema);
        } else {
          this.contextoPreguntas.splice(index, 1);
        }
      }
 }
