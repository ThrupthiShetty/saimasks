import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Contribution } from '../_interface/contribute.model';
@Component({
  selector: 'app-viewcontribute',
  templateUrl: './viewcontribute.component.html',
  styleUrls: ['./viewcontribute.component.scss']
})
export class ViewcontributeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Contribution) {
  }

  ngOnInit() {
  }

}
