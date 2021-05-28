import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as states from '../../resources/states.json';
import { MasksRequetsService } from '../shared/maskrequests.service';

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
  constructor(private formBuilder: FormBuilder,
    private maskRequestService: MasksRequetsService) {
    this.title = 'Angular Form Validation Tutorial';
    this.states = (states as any).default;
    console.log(this.states)

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      saiSamithi: [null, [Validators.required]],
      state: [this.state, [Validators.required]],
      city: [null, [Validators.required]],
      pinCode: [null],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      orgName: [null],
      quantity: [null, Validators.required],
    })
  }

  submit() {
    if (!this.registerForm.valid) {
      console.log("invalid")
      return;
    } else {



//       address: "1234 address"
// city: "hyderbad"
// fullName: "sairam"
// orgName: "ngo"
// phoneNumber: 324324
// pinCode: 342423
// quantity: 100
// saiSamithi: "hyderbad"
// state:
// key: "AP"
// name: "Andhra Pradesh"

      
      const newMaskRequestBody = {
   
        "name": this.registerForm.value.fullName,
       
        "email": this.registerForm.value.city,
        "phone": this.registerForm.value.phone,
        "samithi": this.registerForm.value.saiSamithi,
        "address": this.registerForm.value.address,
        "city": this.registerForm.value.city,
        "state":this.registerForm.value.state.name,
        "postalcode":this.registerForm.value.pinCode,
        "quantity":this.registerForm.value.quantity
    }

    console.log(newMaskRequestBody);
      this.maskRequestService.create('maskrequests', {})
        .subscribe(res => {
          // this.dataSource.data = res as MaskRequest[];


          console.log("new request stored in the db.", res);
        })
    }
   
  }

}
