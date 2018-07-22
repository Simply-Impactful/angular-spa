import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
    imports: [
        MatButtonModule,
        MatGridListModule
    ],
    exports: [
        MatButtonModule,
        MatGridListModule
    ]
})

export class MaterialModule { }