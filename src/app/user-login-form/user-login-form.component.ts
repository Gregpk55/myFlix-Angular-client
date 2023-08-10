// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';



/**
 * Component responsible for managing user login.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Input data for user login, containing the username and password.
   */
  @Input() loginUserData = { Username: '', Password: '' };
 /**
   * Constructs the UserLoginFormComponent.
   * @param fetchApiData Service for making API calls.
   * @param dialogRef Reference to the dialog opened by this component.
   * @param snackBar Service for showing snack bar notifications.
   * @param router Angular Router for navigation.
   */
constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
) {}


ngOnInit(): void {
}

/**
   * Logs the user in by sending the username and password to the backend.
   * If successful, the authentication token and username are stored in local storage,
   * the dialog is closed, and the user is redirected to the movies page.
   */
loginUser(): void {
    this.fetchApiData.userLogin(this.loginUserData).subscribe((result) => {
  // Logic for a successful user login goes here! (To be implemented)
    localStorage.setItem('username', result.user.Username);
    localStorage.setItem('token', result.token);
     this.dialogRef.close(); 
     this.router.navigate(['movies']);
     this.snackBar.open(result, 'OK', {
        duration: 2000
     });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  }