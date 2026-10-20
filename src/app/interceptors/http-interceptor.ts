import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone request and add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle HTTP errors
      if (error.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access - please login');
      } else if (error.status === 403) {
        console.error('Access forbidden');
      } else if (error.status === 404) {
        console.error('Resource not found');
      } else if (error.status >= 500) {
        console.error('Server error');
      }

      return throwError(() => error);
    })
  );
};
