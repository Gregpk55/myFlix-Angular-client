import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  movie: any[] = [];
  favoriteMovies: any[] = [];
  

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadFavoriteMovies();
  }


  openEditUserDialog(): void {
    this.dialog.open(EditUserComponent);
  }
  
  
  loadFavoriteMovies(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (movies: any[]) => {
          this.favoriteMovies = movies;
          if (this.favoriteMovies.length === 0) {
            console.log('No movies found.');
          } else {
            console.log('Favorite Movies:', this.favoriteMovies);
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
  

  toggleFavorite(id: string): void {
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
    } else {
      const username = localStorage.getItem('username');
      if (username) {
        this.fetchApiData.addMovieToFavorites(username, id).subscribe(
          (response) => {
            if (response) {
              this.favoriteMovies.push(id);
              this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
            } else {
              console.error('API response is null or empty.');
              this.snackBar.open('Failed to add to favorites', 'OK', { duration: 2000 });
            }
          },
          (error) => {
            console.error('Error adding movie to favorites:', error);
            this.snackBar.open('Failed to add to favorites', 'OK', { duration: 2000 });
          }
        );
      }
    }
  }

  isFavorite(id: string): boolean {
    return this.favoriteMovies.includes(id);
  }

  removeFavorite(id: string): void {
    const username = localStorage.getItem('username');

    if (!username) {
      console.error('Username not found in local storage.');
      return;
    }

    this.fetchApiData.deleteMovieFromFavorites(username, id).subscribe(
      () => {
        this.favoriteMovies = this.favoriteMovies.filter((movieId) => movieId !== id);
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      },
      (error) => {
        console.error('Error removing movie from favorites:', error);
        this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 2000 });
      }
    );
  }

  getGenre(name: string, description: string): void {
    this.openMovieInfoDialog(name, description);
  }

  getDirector(name: string, bio: string): void {
    this.openMovieInfoDialog(name, bio);
  }

  getSynopsis(description: string): void {
    this.openMovieInfoDialog("Description", description);
  }

  openMovieInfoDialog(title: string, content: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: title,
        content: content,
      }
    });
  }
}
