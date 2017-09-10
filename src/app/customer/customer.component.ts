import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

/**
 * Makes sure the email and confirm email FormControls match each other.
 * If not return a validation object called match.
 * @param c
 */
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
  confirmEmailMessage: string;

  // Property getter
  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private emailMessages = {
    'required': 'Email is required',
    'pattern': 'Please enter a valid email address'
  };

  private confirmEmailMessages = {
    'required': 'Confirm Email is required'
  };

  private validationMessages = {
    'firstName': {
      'required': 'First Name is required',
      'minlength': 'Minimum length is 3'
    },
    'lastName': {
      'required': 'Last Name is required',
      'maxlength': 'Max length is 50'
    },
    'rating': {
      'required': 'Rating is required',
      'range': 'Please rate your experience from 1 to 5'
    },
    'phone': {
      'required': 'Phone is required'
    },
    'emailGroup': {
      'match': 'Confirm email does not match the email address.'
    }
  };

  formErrors = {
    'firstName': '',
    'lastName': '',
    'rating': '',
    'phone': '',
    'emailGroup': ''
  };

  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  confirmEmail = new FormControl();
  sendCatalog = new FormControl(true);
  phone = new FormControl();
  notification = new FormControl();
  rating = new FormControl();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();

    this.customerForm.get('notification').valueChanges
      .subscribe(value => this.setNotification(value));

    // Wanted to see what the code right above this would look like
    // if I created a const like we did on the emailControl valueChanges
    //
    // const notificationControl = this.customerForm.get('notification');
    // notificationControl.valueChanges.subscribe(value =>
    //   this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => this.setEmailMessage(emailControl));

    const confirmEmailControl = this.customerForm.get('emailGroup.confirmEmail');
    confirmEmailControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => this.setConfirmEmailMessage(confirmEmailControl));
  }

  /**
   * Builds the customer form
   */
  buildForm() {
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
      addresses: this.fb.array([ this.buildAddress() ])
    });

    // Watches for all changes on the customer form
    this.customerForm.valueChanges
      .debounceTime(1000)
      .subscribe(data => this.onValueChanged(data));

    // Resets the validation messages
    this.onValueChanged();
  }

  /**
   * When the save button is pressed on the form log info to console
   */
  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  /**
   * Sets the validation message for the email input
   * @param c
   */
  setEmailMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(key =>
        this.emailMessages[key]).join(' ');
    }
  }

  /**
   * Sets the validation message for the confirm email input
   * @param c
   */
  setConfirmEmailMessage(c: AbstractControl): void {
    this.confirmEmailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      console.log(c.errors);
      this.confirmEmailMessage = Object.keys(c.errors).map(key =>
        this.confirmEmailMessages[key]).join(' ');
    }
  }

  /**
   * Build a nested FormGroup for address inputs
   */
  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  /**
   * Changes values for certain fields of the form
   */
  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Bradon',
      lastName: 'Fredrickson',
      sendCatalog: false
    });
  }

  /**
   * Updates the Validators for the phone FormControl
   * if the user changes the Notifications radio button.
   * @param notifyVia
   */
  setNotification(notifyVia: string): void {

    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  /**
   * Loops through all FormControls in the CustomerForm and sets the
   * validation message when appropriate.
   * @param data
   */
  onValueChanged(data?: any) {

    // Make sure the form is valid
    if (!this.customerForm) {
      return;
    }

    // Variable for the form
    const form = this.customerForm;

    // Loop through the form
    for (const field in this.formErrors) {
      // TsLint made me have this if statement
      if (this.formErrors.hasOwnProperty(field)) {

        // Reset the values in the formErrors property and get the current FormControl
        this.formErrors[field] = '';
        const control = form.get(field);

        // Check if the FormControl has been touched or dirty and is not valid
        // If so set the message in the formErrors property.
        if (control && (control.touched || control.dirty) && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  } // Ends onValueChanged

}
