import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormControl } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
    this.customerForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      sendCatalog: this.sendCatalog
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
