import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaskRequest } from '../_interface/maskrequest.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MasksRequetsService } from '../shared/maskrequests.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-contribute-request',
  templateUrl: './contribute-request.component.html',
  styleUrls: ['./contribute-request.component.scss']
})
export class ContributeRequestComponent implements OnInit {
  public dialogRef: MatDialogRef<ContributeRequestComponent>;
  contributeForm: FormGroup;
  showProgress: boolean = false;
  submitted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public id: any,
  private formBuilder: FormBuilder,
    private maskRequestService: MasksRequetsService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,) {
      console.log(this.id)

  }
  ngOnInit() {
    this.submitted = false;
    this.contributeForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, Validators.required],
      comments: [null, Validators.required]
    })

  }

  submit (contData) {
    if (!this.contributeForm.valid) {
      console.log("invalid")
      return;
    } else {
      this.showProgress = true;
      let contributeMaskRequestBody = {
        "id": this.id,
        "name": this.contributeForm.value.fullName,
        "email": this.contributeForm.value.email,
        "phoneNumber": this.contributeForm.value.phoneNumber ,
        "comments"  : this.contributeForm.value.comments
      }
      console.log(contributeMaskRequestBody);
      this.maskRequestService.create('maskrequests/contribute/'+this.id, contributeMaskRequestBody)
        .subscribe(res => {

          // this.dataSource.data = res as MaskRequest[];
          console.log("contribution request stored in the db.", res);
        //  this._snackBar.open("Your contribution details has been successfully submitted", "Success");
         // this.dialogRef.close();
        })
      this.submitted = true;
      this.showProgress = false;
    }

  }

}
