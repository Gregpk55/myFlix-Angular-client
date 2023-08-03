import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    console.log('Username:', username);
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response: any) => {
      this.movies = response;

      this.checkFavorites();
    });
  }

  checkFavorites(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.fetchApiData.getUser(username).subscribe((response: any) => {
        this.favorites = response.FavoriteMovies;
      });
    }
  }

  getGenre(name: string, description: string): void {
    this.openMovieInfoDialog(name, description);
  }

  getDirector(name: string, bio: string): void {
    this.openMovieInfoDialog(name, bio);
  }

  getSynopsis(description: string): void {
    this.openMovieInfoDialog('Description', description);
  }

  openMovieInfoDialog(title: string, content: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: title,
        content: content,
      },
    });
  }

  addFavorite(id: string): void {
    console.log('Adding movie to favorites with ID:', id);

    const username = localStorage.getItem('username');

    if (username && !this.isFavorite(id)) {
      this.fetchApiData.addMovieToFavorites(username, id).subscribe(
        (response) => {
          console.log('API Response:', response);
          if (response) {
            this.favorites.push(id);
            console.log('Updated favorites array:', this.favorites);
            this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
          } else {
            console.error('API response is null or empty.');
            this.snackBar.open('Failed to add to favorites', 'OK', {
              duration: 2000,
            });
          }
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
          this.snackBar.open('Failed to add to favorites', 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      console.log('Movie is already in favorites.');
      this.snackBar.open('Movie is already in favorites', 'OK', {
        duration: 2000,
      });
    }
  }

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  removeFavorite(id: string): void {
    const username = localStorage.getItem('username');

    if (!username) {
      console.error('Username not found in local storage.');
      return;
    }

    this.fetchApiData.deleteMovieFromFavorites(username, id).subscribe(
      () => {
        this.favorites = this.favorites.filter((movieId) => movieId !== id);
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      },
      (error) => {
        console.error('Error removing movie from favorites:', error);
        this.snackBar.open('Failed to remove from favorites', 'OK', {
          duration: 2000,
        });
      }
    );
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
              this.favorites.push(id);
              this.snackBar.open('Added to favorites', 'OK', {
                duration: 2000,
              });
            } else {
              console.error('API response is null or empty.');
              this.snackBar.open('Failed to add to favorites', 'OK', {
                duration: 2000,
              });
            }
          },
          (error) => {
            console.error('Error adding movie to favorites:', error);
            this.snackBar.open('Failed to add to favorites', 'OK', {
              duration: 2000,
            });
          }
        );
      }
    }
  }
}
