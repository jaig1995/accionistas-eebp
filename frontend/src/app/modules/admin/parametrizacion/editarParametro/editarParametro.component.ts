import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ParametrizacionService } from '../parametrizacion.service';


@Component({
    selector: 'app-editar-parametro',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule

    ],
    templateUrl: './editarParametro.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class EditarParametroComponent implements OnInit {

    formulario!: FormGroup;


    constructor(
        public dialogRef: MatDialogRef<EditarParametroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private readonly fb: FormBuilder,
        private parametrizacionService: ParametrizacionService
    ) {
        this.formulario = this.fb.group({
            idParametro: [''],
            descripcion: ['',Validators.required],
            valor: [''],
        });
    }


    ngOnInit(): void {
        if (this.data && this.data.parametro) {
            if (this.data.parametro.idParametro !== undefined) {
                this.formulario.patchValue({
                    idParametro: this.data.parametro.idParametro
                });
            }
            if (this.data.parametro.descripcion !== undefined) {
                this.formulario.patchValue({
                    descripcion: this.data.parametro.descripcion
                });
            }
            if (this.data.parametro.valor !== undefined) {
                this.formulario.patchValue({
                    valor: this.data.parametro.valor
                });
            }
        }
    }

    /**
     * Método para guardar un parámetro.
     * Si el modo es 'editar', llama al servicio para editar el parámetro y cierra el diálogo.
     * Si el modo es 'crear', llama al servicio para crear el parámetro y cierra el diálogo.
     */
    guardarParametro() {
        if (this.data.modo === 'editar') {
            this.parametrizacionService.editarParametros(this.formulario.value).subscribe(
                data => console.log(data),
                error => console.error('Error:', error),
                () => console.log('Observable completado')
            );
            this.dialogRef.close(true);
        } else if (this.data.modo === 'crear') {
            this.parametrizacionService.crearParametro(this.formulario.value).subscribe(
                data => console.log(data)
            );
            this.dialogRef.close(true);
        }
        this.dialogRef.close(true);
    }

}


