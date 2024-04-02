import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlTitulosService } from '../../controlTitulos.service';
import { CompraPublicacionModalComponent } from '../compraPublicacionModal/compraPublicacionModal.component';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'app-sucesion-publicacion-modal',
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
    templateUrl: 'sucesionPublicacionModal.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SucesionPublicacionModalComponent {

    //Autocompletar
    filteredAccionistas: Observable<any[]>;
    accionistas: any[] = [];

    //validaciones
    isLoading: boolean = true;

    public tomadoresForm: FormGroup = this.fb.group({
        tomadores: this.fb.array([], [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)])
    });



    miFormulario: FormGroup;
    datosModal: FormGroup;

    formulario: any


    constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CompraPublicacionModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private controlTitulosService: ControlTitulosService) {
        this.miFormulario = this.fb.group({
            nombre: ['', Validators.required]
        });

    }

    submit() {
        this.isLoading= false;
        let titulos = this.data.arrayTitulos.map(data => {
            return {
                conseTrans: data.conseTrans,
                conseTitulo: data.conseTitulo,
                numAcciones: data.numAcciones
            }
        }
        )

        let tomadores = this.tomadores.value;
        let arrayTomadores = tomadores.map(nombre => {
            return { "idePer": nombre };
        });

        let transaccion = {
            titulos,
            tomadores: arrayTomadores

        }

        this.controlTitulosService.sucesionTitulo(transaccion).subscribe(
            {
                next:(data) =>{
                this.dialogRef.close({ success: true });
                },
                error: (error) => {
                    this.dialogRef.close({ success: false });
                }
            }
        )
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
    filterAccionistas(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.toLowerCase().includes(filterValue));
    }

    private _filterAccionistas(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.accionistas.filter(accionista => accionista.Nombres.toLowerCase().includes(filterValue));
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


}
