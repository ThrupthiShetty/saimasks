import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as states from '../../resources/states.json';

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
  constructor(private formBuilder: FormBuilder) { 
    this.title = 'Angular Form Validation Tutorial';
    this.states =  (states as any).default;
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
    }
    console.log(this.registerForm.value);
  }

}
