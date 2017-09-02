import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup;
  customer: Customer = new Customer();

  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  sendCatalog = new FormControl(true);
  phone = new FormControl();
  notification = new FormControl();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['',
        [Validators.required, Validators.minLength(3)]
      ],
      lastName: ['',
        [Validators.required, Validators.maxLength(50)]
      ],
      email: ['',
        [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]
      ],
      phone: '',
      notification: 'email',
      sendCatalog: true
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Bradon',
      lastName: 'Fredrickson',
      sendCatalog: false
    });
  }

  setNotification(notifyVia: string): void {

    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

}
