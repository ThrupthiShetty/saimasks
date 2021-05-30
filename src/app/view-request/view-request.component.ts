import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaskRequest } from '../_interface/maskrequest.model';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss']
})
export class ViewRequestComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: MaskRequest) {
    console.log(data)
   }

  ngOnInit() {
  }

}
