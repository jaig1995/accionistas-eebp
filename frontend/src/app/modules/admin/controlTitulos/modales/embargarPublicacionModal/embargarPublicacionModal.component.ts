import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-embargar-publicacion-modal',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>embargarPublicacionModal works!</p>`,
    styleUrls: ['./embargarPublicacionModal.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbargarPublicacionModalComponent { }
