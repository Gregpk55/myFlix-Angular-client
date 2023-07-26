import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  favoriteMovies: any[] = [];

  constructor(private fetchApiData: FetchApiDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadFavoriteMovies();
  }

  loadFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (movies: any[]) => {
          this.favoriteMovies = movies;
          if (this.favoriteMovies.length === 0) {
            console.log('No movies found.');
          }
        },
        (error) => {
          console.error('Error fetching favorite movies:', error);
        }
      );
    } else {
      console.log('Username not found in local storage');
    }
  }

  openEditUserDialog(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      height: '500px',
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      
      if (result) {
        // Reload the user's favorite movies after successful update
        this.loadFavoriteMovies();
      }
    });
  }
}
