import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: 'hello',
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

}
