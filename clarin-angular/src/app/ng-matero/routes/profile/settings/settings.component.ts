import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { LoggingInterceptor } from '@core/interceptors/logging-interceptor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user-service/user.service';
import { FlashMessagesService } from 'flash-messages-angular';
/*import { ErrorStateMatcher } from '@angular/material/core';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

*/






@Component({
  selector: 'app-profile-settings',
  templateUrl: './settings.component.html',
})
export class ProfileSettingsComponent implements OnInit {
  reactiveForm: FormGroup;
  UpdatePasswordForm: FormGroup;

 // matcher = new MyErrorStateMatcher();

  constructor(public userService: UserService,
    public flashMessage: FlashMessagesService,private fb: FormBuilder) {
    


    this.reactiveForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''], //[Validators.required]],
      city: [''],// [Validators.required]],
      address: [''], //[Validators.required]],
      company: [''], //[Validators.required]],
      birthdate: ['']//, [Validators.required]],
    });
    
    this.UpdatePasswordForm = this.fb.group({
      currentpassword: ['', [Validators.required]],
      newpassword: ['', [Validators.required]],
   // confirmnewpassword: ['', [Validators.required]],
    confirmnewpassword: ['', [this.confirmValidator]]

    });


  }

  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.UpdatePasswordForm.controls.newpassword.value) {
      return { error: true, confirm: true };
    }
    return {};
  };

 /* checkPasswords: ValidatorFn = (control: FormControl): { [k: string]: boolean } => {
    console.log(control.value)
    if(this.UpdatePasswordForm!==undefined){
    console.log(this.UpdatePasswordForm.controls.newpassword.value)
    }
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.UpdatePasswordForm.controls.newpassword.value) {
      return { error: true, confirm: true };
    }
    return {};
  };
  */
  
  /*(group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('newpassword').value;
    let confirmPass = group.get('confirmnewpassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

*/




  ngOnInit() {
    
   // this.handleClick()
  }

  updatePassword(credentials) {
    // Ensure we have a valid CSRF token...
    //this.refreshCSRFToken();
    console.log("update_password")
    let state= this.UpdatePasswordForm.valid
    if (state===true){
      //data for request
        let passwords={
              "old_password":this.UpdatePasswordForm.controls["currentpassword"].value,
              "new_password":this.UpdatePasswordForm.controls["newpassword"].value
        }

    //var deferred = $q.defer();
    //var sanCredentials = sanitizeObj(credentials);
      
    this.userService.updatePassword(passwords)
    .then((response) => {
      this.UpdatePasswordForm.reset()
      for (let control in this.UpdatePasswordForm.controls) { this.UpdatePasswordForm.controls[control].setErrors(null); }
      console.log(response.message)

      this.flashMessage.show(response.message, { cssClass: 'alert alert-warning', timeout: 2000 });

    }, (error) => {
      console.log(error.message)
      this.flashMessage.show(error.message, { cssClass: 'alert alert-warning', timeout: 2000 });
    });
};   





    


  }
  
 /* updatePassword(){
    let state= this.UpdatePasswordForm.valid
    if (state===true){
      //data for request
        let passwords={
              "old_password":this.UpdatePasswordForm.controls["currentpassword"].value,
              "new_password":this.UpdatePasswordForm.controls["newpassword"].value


        }

        
    
      /*  this.userService.updatePassword(passwords)
          .then((response) => {
            this.initializeInfo();
    
            this.flashMessage.show(response.message, { cssClass: 'alert alert-warning', timeout: 2000 });
    
          }, (error) => {
            this.flashMessage.show(error.message, { cssClass: 'alert alert-warning', timeout: 2000 });
          });
      };

        
        console.log(passwords)  

    }


  }*/


  
  UpdateProfile() { 
   let state= this.reactiveForm.valid
   if (state===true){
      
      
      let birthdate_val=(this.reactiveForm.controls["birthdate"].value)["_i"]
   //   console.log(birthdate_val)
      //data for request
      let profiledata={
        "firstname":this.reactiveForm.controls["firstname"].value
        ,"lastname":this.reactiveForm.controls["lastname"].value,
        "email":this.reactiveForm.controls["email"].value,
        "gender":this.reactiveForm.controls["gender"].value,
        "city":this.reactiveForm.controls["city"].value,
        "address":this.reactiveForm.controls["address"].value,
        "company":this.reactiveForm.controls["company"].value,
        "birthdate":birthdate_val
      }
      console.log(profiledata)
    
      
  } 
}





  
  getErrorMessage(form: FormGroup) {
    return form.get('email')?.hasError('required')
      ? 'You must enter a value'
      : form.get('email')?.hasError('email')
      ? 'Not a valid email'
      : '';
  }
}
