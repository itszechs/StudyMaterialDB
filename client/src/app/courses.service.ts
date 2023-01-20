import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private url = 'http://127.0.0.1:5500';
  private course$: Subject<Course[]> = new Subject();

  constructor(private httpClient: HttpClient) {
    this.refreshCourses();
  }


  private refreshCourses() {
    this.httpClient.get<Course[]>(`${this.url}/courses`)
      .subscribe(employees => {
        this.course$.next(employees);
      });
  }

  getCourses(): Subject<Course[]> {
    this.refreshCourses();
    return this.course$;
  }

  getCourse(id: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.url}/course/${id}`);
  }


}