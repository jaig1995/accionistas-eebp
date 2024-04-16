import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-button-cargar-documentos',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule
    ],
    templateUrl: 'buttonCargarDocumentos.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCargarDocumentosComponent {

    @Output() archivo: EventEmitter<any> = new EventEmitter();
    @Output() contieneArchivo: EventEmitter<boolean> = new EventEmitter(false);
    @Input() nombreBoton: string;
    @Input() formatosAceptados: string;

    archivoSeleccionado: any;



    archivoSelecionado(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.archivoSeleccionado = file
            this.contieneArchivo.emit(true)
        }
    }

    enviarArchivo(nuevoNombre: string) {
        if (!this.archivoSeleccionado) return;

        const fileExtension = this.archivoSeleccionado.name.split('.').pop();
        const nuevoArchivo = new File([this.archivoSeleccionado], nuevoNombre + '.' + fileExtension, {
            type: this.archivoSeleccionado.type,
            lastModified: this.archivoSeleccionado.lastModified
        });

        this.archivoSeleccionado = nuevoArchivo;
        this.archivo.emit(this.archivoSeleccionado)
    }
}
