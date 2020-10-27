import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { Group } from '../model/Group';

@Component({
  selector: 'app-join-group-modal',
  templateUrl: './join-group-modal.component.html',
  styleUrls: ['./join-group-modal.component.scss']
})
export class JoinGroupModalComponent implements OnChanges, OnInit {

    @Input() group: Group;

    ngOnInit() {
        // this.closeDialog();
    }

    ngOnChanges() {
        if (this.group !== undefined) {
            this.openDialog();
        }
    }

    closeDialog() {
        document.getElementById('mmodal').style.visibility = 'hidden';
        document.getElementById('mmodal-background').style.visibility = 'hidden';
    }

    openDialog() {
        document.getElementById('mmodal').style.visibility = 'visible';
        document.getElementById('mmodal-background').style.visibility = 'visible';
    }

}
