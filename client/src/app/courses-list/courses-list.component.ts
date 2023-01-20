import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../course';
import { CourseService } from '../courses.service';

declare var bootstrap: any;

@Component({
  selector: 'app-courses-list',
  template: `<h2 class="text-center m-5">Courses List</h2>
  <table class="table">
      <thead>
          <tr>
              <th>Course code</th>
              <th>Course name</th>
              <th>Action</th>
          </tr>
      </thead>
      <tbody>
          <tr *ngFor="let course of courses$ | async">
              <td>{{course.course_code}}</td>
              <td>{{course.course_name}}</td>
              <td>
                  <button class="btn btn-primary me-1" (click)="openModal(course.course_code, course.course_name, course.files)" data-bs-toggle="modal" data-bs-target="#filesModal">Show files</button>
              </td>
          </tr>
      </tbody>
  </table>
  <div class="modal fade" id="filesModal" tabindex="-1" aria-labelledby="filesListModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="filesListModal">New message</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       <table class="table" id="filesList">
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

`
})
export class CoursesListComponent implements OnInit {
  courses$: Observable<Course[]> = new Observable();

  constructor(private coursesService: CourseService) { }

  ngOnInit(): void {
    this.fetchCourses();
  }

  private fetchCourses(): void {
    this.courses$ = this.coursesService.getCourses();
  }

  private formatBytes(a: number, b = 2): string {
    if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]}`;
  }

  openModal(courseCode: string, courseName: string, files: any[]) {
    const modal = document.getElementById('filesModal');
    const modalTitle = modal?.querySelector('.modal-title');
    const modalTable = modal?.querySelector('.table');
    if (modalTitle != null && modalTable != null) {
      modalTitle.textContent = `${courseCode} - ${courseName}`;
      modalTable.innerHTML = `
      <thead>
          <tr>
            <th>File name</th>
            <th>File size</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${files.map(file => `
          <tr>
            <td>${file.name}</td>
            <td>${this.formatBytes(file.size)}</td>
            <td>
                 <button type="button" class="btn btn-labeled btn-primary" data-bs-toggle="modal" data-bs-target="#downloadModal">
                    <span class="btn-label"> <i class="fa fa-download"></i></span>Download
                </button>
                </td>
          </tr>
          `).join('')}
        </tbody>
      `;
    }
  }

}