import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

/**
 * API URL providing data for the client application.
 */
const apiUrl = 'https://greg-kennedy-myflix.herokuapp.com/';
/**
 * FetchApiDataService provides methods to interact with the API.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  
  constructor(private http: HttpClient) {
  }
  /**
   * Register a new user.
   * @param userDetails The user details for registration.
   * @returns An observable of the HTTP response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError),
      tap(() => console.log('User created '))
    );
  }

  /**
   * Log in an existing user.
   * @param userDetails The user details for login.
   * @returns An observable of the HTTP response.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError),
      tap(() => console.log('user logged in'))
    );
  }

  /**
   * Get all movies.
   * @returns An observable containing all movies.
   */ 
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get a single movie by title.
   * @param title The title of the movie.
   * @returns An observable containing the movie.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

   /**
   * Get information about a director by name.
   * @param directorName The name of the director.
   * @returns An observable containing information about the director.
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get information about a genre by name.
   * @param genreName The name of the genre.
   * @returns An observable containing information about the genre.
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get a user's details by username.
   * @param username The username of the user.
   * @returns An observable containing the user's details.
   */
  getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get a user's favorite movies.
   * @param username The username of the user.
   * @returns An observable containing the user's favorite movies.
   */
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data: any) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

   /**
   * Add a movie to a user's favorites.
   * @param username The username of the user.
   * @param movieId The ID of the movie to add.
   * @returns An observable of the HTTP response.
   */ 
  addMovieToFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {},
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: "text"
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Edit user.
   * @param updatedUser The new user data.
   * @returns An observable of the HTTP response.
   */
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
  
    console.log('Editing user:', username); 
    console.log('Token:', token); 
    console.log('Data to be updated:', updatedUser); 
  
    return this.http
      .put(apiUrl + 'users/' + username, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log('Server response:', response); 
        }),
        catchError((error) => {
          console.log('Error:', error); 
          return this.handleError(error);
        })
      );
  }


/**
   * Delete user.
   * @param username The username to delete.
   * @returns An observable of the HTTP response.
   */
deleteUser(username: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.delete(apiUrl + `users/${username}`, {
    responseType: 'text',
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }).pipe(
    catchError(this.handleError)
  );
}



  /**
   * Delete a movie from a user's favorites.
   * @param username The username of the user.
   * @param movieId The ID of the movie to delete.
   * @returns An observable of the HTTP response.
   */
  deleteMovieFromFavorites(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Extracts data while providing a fallback.
   * @param res The response to extract data from.
   * @returns The extracted data or an empty object.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

   /**
   * Handle errors from HTTP requests.
   * @param error The error to handle.
   * @returns An observable with the error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}