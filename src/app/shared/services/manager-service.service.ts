import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  allManager: any[] = [];
  managerGetURL: string = '';
  managerAddURL: string = '';
  managerUpdateURL: string = '';
  managerDeleteURL: string = '';
  constructor(private http: HttpClient) { }

  getAllmanagers() {
    return this.http.get(this.managerGetURL + '/');
  }

  addmanager(manager) {
    return this.http.post(this.managerAddURL + '/', manager,);
  }

  deletemanager(id) {
    return this.http.delete(this.managerDeleteURL + '/' + id);
  }

  updatemanager(id, manager) {
    return this.http.put(this.managerUpdateURL + '/' + id, manager);
  }


}
