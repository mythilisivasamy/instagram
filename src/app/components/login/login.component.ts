import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl} from '@angular/forms';
import { UserService } from 'src/app/shared/userService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 isLoading=false;
  constructor(private us:UserService, private router: Router) { }
  loginForm=new FormGroup({
    userName:new FormControl(''),
    password:new FormControl('')
  }
  )
  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }
  ngOnInit(): void {
  }

  login(){
  this.us.login({userName:this.userName!.value,password:this.password!.value})
  .subscribe(
    (res:any)=>{
      this.us.isLoggedIn=true;
      console.log(res.authInfo);
      localStorage.setItem('authInfo',JSON.stringify(res.authInfo))
      this.router.navigate([''])
    },
    (err)=>{console.log(err)}
  )
  }

}
