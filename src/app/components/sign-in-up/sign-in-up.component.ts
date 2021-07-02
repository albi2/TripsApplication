import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { JwtResponse } from 'src/app/models/JwtResponse';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.scss']
})
export class SignInUpComponent implements OnInit {

  @Input() signupMode: boolean;
  type = "student";
  signInGroup = this.fb.group({
    username: [''],
    password: ['']
  });

  signUpGroup = this.fb.group({
    username: [''],
    email: [''],
    password: ['']
  })

  constructor(private fb: FormBuilder,  private router: Router,private auth: AuthService) { 
  }

  ngOnInit() {
  }

 onLoginClicked() {
  //  const email = this.signInGroup.get('email').value;
  //  const password = this.signInGroup.get('password').value;
  //  this.auth.login(email, password).subscribe((response: HttpResponse<any>) => {
  //    if(response.status === 200) {
  //     this.router.navigate(['/user']);
  //    }
  //    console.log(response);
  //  });
  const username = this.signInGroup.get('username').value;
  const password = this.signInGroup.get('password').value;
   this.auth.login(username, password).subscribe((response: JwtResponse) => {
      if(this.auth.isUser())
        this.router.navigate(["/myProfile/my-trips"]);
      else if(this.auth.isAdmin()) {
        this.router.navigate(["/admin/users"]);
      }
   }, err => {
     console.log(err);
   });
 }
}
