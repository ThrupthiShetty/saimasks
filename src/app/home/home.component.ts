import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as states from '../resources/states.json';
import { MasksRequetsService } from '../shared/maskrequests.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewRequestComponent } from '../view-request/view-request.component';

interface State {
  key: string;
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string = "welcome to angle";
  registerForm: FormGroup;
  states: State[];
  state: any;
  submitted: boolean = false;
  showProgress: boolean = false;
  requestId: string;
  constructor(private formBuilder: FormBuilder,
    private maskRequestService: MasksRequetsService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.title = 'Angular Form Validation Tutorial';
    this.states = (states as any).default;
    // console.log(this.states)

  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id')
    //console.log("id is ", this.requestId)
    this.submitted = false;
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
   //   saiSamithi: [null, [Validators.required]],
      state: [this.state, [Validators.required]],
      city: [null, [Validators.required]],
      pinCode: [null],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      comments: [null],
      orgName: [null,[Validators.required]],
      quantity: [null, Validators.required],
    })

    console.log(`form submit status ${this.submitted}`)
  }

  submit() {
    if (!this.registerForm.valid) {
      console.log("invalid")
      return;
    } else {
      this.showProgress = true;
      let newMaskRequestBody = {
        "name": this.registerForm.value.fullName,
        "email": this.registerForm.value.email,
        "phone": this.registerForm.value.phoneNumber || 1213121,
    //    "samithi": this.registerForm.value.saiSamithi,
        "address": this.registerForm.value.address,
        "comments": this.registerForm.value.comments,
        "city": this.registerForm.value.city,
        "state": this.registerForm.value.state.name,
        "postalcode": this.registerForm.value.pinCode,
        "quantity": this.registerForm.value.quantity,
        "orgName" : this.registerForm.value.orgName

      }
      console.log(newMaskRequestBody);
      this.maskRequestService.create('maskrequests', newMaskRequestBody)
        .subscribe(res => {
          // this.dataSource.data = res as MaskRequest[];
          console.log("new request stored in the db.", res);
        //  this._snackBar.open("Your request has been successfully submitted", "Success");
          let dialogPayload: any = newMaskRequestBody;
          dialogPayload.soucecomp = "newrequest"
          dialogPayload.id = (res as any).id;
          this.openDialog(dialogPayload);
          this.router.navigate(['/dashboard'])

        })
      this.submitted = true;
      this.showProgress = false;
    }

  }

  openDialog(details) {
    details.soucecomp = "newreq"
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ViewRequestComponent, {
      data: details
    });
  }


}
