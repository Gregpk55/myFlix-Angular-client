import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  user: any = {};
  updatedUserData: any = { Username: '', Password: '', Email: '', Birthday: '' };
  userData: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response) => {
        this.user = response;
        this.updatedUserData = {
          Username: this.user.Username,
          Password: this.user.Password, 
          Email: this.user.Email,         
        };
      }, (error: any) => {
        this.showSnackBar(error);
      });
    }
  }

  editUser(): void {
    console.log('Editing user:', this.user); 
    this.fetchApiData.editUser(this.user).subscribe(
      response => {
        console.log('Server response:', response);      
      },
      error => {
        console.error('There was an error updating the user:', error);
      }
    );
  }  
  
  deleteUser(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.deleteUser(username).subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['welcome']);
          this.showSnackBar('User successfully deleted');
        },
        error: (err) => {
          console.log(err); 
          if(err.status === 401){
            this.showSnackBar('Your session has expired or your account has been deleted. Please log in again.');
          } else {
            this.showSnackBar('Error occurred while deleting user: ' + err);
          }
        },
      });
    }
  }
  

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 2000
    });
  }
}
