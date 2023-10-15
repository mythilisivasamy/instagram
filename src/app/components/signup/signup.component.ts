import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  stringValidator,
  emailValidator,
  numberValidator,
} from 'src/app/shared/customValidator';
import { User } from '../../shared/user';
import { UserService } from 'src/app/shared/userService';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private us: UserService) {}
  user!: User;
  @ViewChild('sign') sign!: ElementRef;
  errorMessage:unknown;
  signupForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      stringValidator(/^[a-zA-Z\s]+$/),
    ]),
    password: new FormControl(''),
    cnfrmPassword: new FormControl(''),
    fullName: new FormControl('', [
      Validators.required,
      stringValidator(/^[a-zA-Z\s]+$/),
    ]),
    email: new FormControl('', [
      Validators.required,
      emailValidator(/^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+.[a-zA-z]$/),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      numberValidator(/\d{10}/),
    ]),
  });
  get userName() {
    return this.signupForm.get('userName');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get cnfrmPassword() {
    return this.signupForm.get('cnfrmPassword');
  }
  get fullName() {
    return this.signupForm.get('fullName');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get phoneNumber() {
    return this.signupForm.get('phoneNumber');
  }
  ngOnInit(): void {}
  checkPassword(name: any) {
    if (this.password!.value !== this.cnfrmPassword!.value) {
      alert('Password did not match');
      const ele = this.sign.nativeElement[name];
      if (ele) {
        ele.focus();
      }
    }
  }
  addUser() {
    this.user = {
      userName: this.userName!.value,
      password: this.password!.value,
      fullName: this.fullName!.value,
      email: this.email!.value,
      phoneNumber: this.phoneNumber!.value,
    };
    this.us.addUser(this.user).subscribe(
      (error) => {             
        //Error callback
        console.error('error caught in component')
        this.errorMessage = error;
        
    
  })
}
}