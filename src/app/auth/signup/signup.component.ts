import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;

  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if(!form.valid)
      return;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
