import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [
        CommonModule,
        InputAutocompleteComponent,
        AngularMaterialModules
    ],
    templateUrl: 'asistencia.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsistenciaComponent {

    loading: boolean;
    showAlert: any;
    poderdante: string;
    valorInput: string
    ejemplo = [
        {
          idAsistente: 1,
          asistencia: false,
          acciones: 80,
          codUsuario: "A123",
          nombres: "Juan",
          apellidos: "Perez",
          celPersona: "123456789",
          correoPersona: "juan@example.com"
        },
        {
          idAsistente: 2,
          asistencia: false,
          acciones: 75,
          codUsuario: "B456",
          nombres: "María",
          apellidos: "Gómez",
          celPersona: "987654321",
          correoPersona: "maria@example.com"
        },
        {
          idAsistente: 3,
          asistencia: false,
          acciones: 85,
          codUsuario: "C789",
          nombres: "Pedro",
          apellidos: "López",
          celPersona: "654987321",
          correoPersona: "pedro@example.com"
        },
        {
          idAsistente: 4,
          asistencia: 92,
          acciones: 78,
          codUsuario: "D101",
          nombres: "Ana",
          apellidos: "Martínez",
          celPersona: "321456987",
          correoPersona: "ana@example.com"
        },
        {
          idAsistente: 5,
          asistencia: 88,
          acciones: 82,
          codUsuario: "E202",
          nombres: "Luis",
          apellidos: "Rodríguez",
          celPersona: "789123654",
          correoPersona: "luis@example.com"
        }
      ];


    displayedColumns: string[] = ['NUMERO','ASISTENCIA' ,'ACCIONES', 'IDENTIFICACION', 'NOMBRES', 'APELLIDOS', 'TELEFONO', 'CORREO'];
    dataSource = new MatTableDataSource<any>(this.ejemplo)

    obtenerPoderdante(valor: string) {
        this.poderdante = valor;
        console.log("desde obtenerPoderdante", valor)
    }
    obtenerValorInput(valor: string) {
        this.valorInput = valor
        console.log("desde obtenerValorInput", valor)
    }

    buscarAccionista() {


    }


    imprimirFila(row: any): void {
        row.asistencia = !row.asistencia;
        console.log('Información de la fila:', row);
        // Aquí puedes hacer lo que quieras con la fila, como imprimir sus propiedades o enviarla a otro lugar
      }
}
