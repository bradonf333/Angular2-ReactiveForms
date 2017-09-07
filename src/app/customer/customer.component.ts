import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';

function emailMatcher(c: AbstractControl) {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');
  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { 'match': true };
}

/**
 * Checks to make sure the users input is within the given range
 * @param min
 * @param max
 */
function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm: FormGroup;
  customer: Customer = new Customer();
  emailMessage: string;

  private validationMessages = {
    email: {
      'required': 'Email is required',
      'pattern': 'Please enter a valid email address'
    },
    // required: 'Please enter your email address.',
    // pattern: 'Please enter a valid email address'
  };

  formErrors = {
    'firstName': '',
    'lastName': '',
    'phone': '',
    'emailGroup': {
      'email': '',
      'confirmEmail': ''
    }
  };

  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  sendCatalog = new FormControl(true);
  phone = new FormControl();
  notification = new FormControl();
  rating = new FormControl();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['',
        [Validators.required, Validators.minLength(3)]
      ],
      lastName: ['',
        [Validators.required, Validators.maxLength(50)]
      ],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        confirmEmail: ['', Validators.required]
      }, { validator: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: ['', ratingRange(1, 5)],
      sendCatalog: true,
    });

    this.customerForm.get('notification').valueChanges
      .subscribe(value => this.setNotification(value));

    // Wanted to see what the code right above this would look like
    // if I created a const like we did on the emailControl valueChanges
    //
    // const notificationControl = this.customerForm.get('notification');
    // notificationControl.valueChanges.subscribe(value =>
    //   this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.subscribe(value =>
      this.setMessage(emailControl));
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    console.log(c.parent.controls);
    console.log('c.errors: ' + Object.keys(c.errors));
    console.log('this.validationMessages: ' + Object.keys(this.validationMessages));
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(key =>
        this.validationMessages[key]).join(' ');
    }
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
