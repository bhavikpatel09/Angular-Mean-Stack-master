import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  forgotForm: FormGroup;
  email = new FormControl('', [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)]);
  constructor(private auth: AuthService, private formBuilder: FormBuilder,
    private router: Router,
    public toast: ToastComponent) { }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: this.email,
    });
  }
  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }
  forgot() {
    this.auth.forgot(this.forgotForm.value).subscribe(
      res => this.router.navigate(['/']),
      error => this.toast.setMessage('invalid email!', 'danger')
    );
  }

}
