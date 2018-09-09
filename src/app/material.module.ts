import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialogModule } from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';




@NgModule({
    imports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatFormFieldModule,
        MatMenuModule,
        MatRadioModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatDividerModule,
        MatBadgeModule,
        MatDialogModule
    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatFormFieldModule,
        MatMenuModule,
        MatRadioModule,
        MatToolbarModule,
        MatSelectModule,
        MatTabsModule,
        MatDividerModule,
        MatBadgeModule,
        MatDialogModule
    ]
})

export class MaterialModule { }