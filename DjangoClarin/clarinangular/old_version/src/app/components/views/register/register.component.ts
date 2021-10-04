import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
    private user: UserService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [this.confirmValidator]],
      agree: [true, [this.termsFormControl]],
    });
  }

  get firstname() {
    return this.registerForm.get("firstname");
  }

  get lastname() {
    return this.registerForm.get("lastname");
  }

  get username() {
    return this.registerForm.get("username");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }

  get agree() {
    return this.registerForm.get("agree");
  }

  termsFormControl = (control: FormControl) => {
    return !control.value ? { 'required': true } : null;
  };

  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.registerForm.controls.password.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

  register() {
    /* console.error("RegisterComponent: register():",
         this.firstname.value, this.lastname.value, this.username.value,
         this.password.value, this.confirmPassword.value,
         this.agree.value); */
    var regInfo = {
      name: this.firstname.value + ' ' + this.lastname.value,
      first_name: this.firstname.value,
      last_name: this.lastname.value,
      email: this.username.value,
      password: this.password.value,
    }
    this.user.register(regInfo)
      .then((response) => {
        this.flashMessage.show(response.message,
          { cssClass: 'alert alert-warning', timeout: 10000 });
        this.router.navigateByUrl('/auth/login');
      }, (error) => {
        this.flashMessage.show(error.message,
          { cssClass: 'alert alert-warning', timeout: 10000 });
      });
  }; /* register */
}
