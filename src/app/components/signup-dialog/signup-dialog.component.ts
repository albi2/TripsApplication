import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserCreationDTO } from 'src/app/models/UserCreationDTO';
@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {
  signUpGroup = this._fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  }
  )

  constructor(public dialogRef: MatDialogRef<SignupDialogComponent>,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createUser() {
    let newUser: UserCreationDTO = {
      username: this.signUpGroup.get("username").value,
      email: this.signUpGroup.get("email").value,
      password: this.signUpGroup.get("password").value
    };

    return newUser;
  }

}
