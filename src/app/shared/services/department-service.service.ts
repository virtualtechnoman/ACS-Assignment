import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  departmentGetEndpoint: string = '';
  departmentAddEndpoint: string = '';
  departmentUpdateEndpoint: string = '';
  departmentDeleteEndpoint: string = '';
  allDepartments: any[] = [];
  constructor(private http: HttpClient) { }

  getAllDepartments() {
    return this.http.get(this.departmentGetEndpoint + '/');
  }

  addDepartment(Department) {
    return this.http.post(this.departmentAddEndpoint + '/', Department,);
  }

  updateDepartment(id, Department) {
    return this.http.put(this.departmentUpdateEndpoint + '/' + id, Department);
  }

  deleteDepartment(id) {
    return this.http.delete(this.departmentDeleteEndpoint + '/' + id);
  }


}
