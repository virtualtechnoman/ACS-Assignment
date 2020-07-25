import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../shared/services/manager-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  allManagers: any[] = [];
  editing: boolean = false;
  managerForm: FormGroup;
  submitted: boolean = false;
  selectedManagerIndex: number;
  uploading: boolean = false;
  constructor(private ManagerService: ManagerService, private formBuilder: FormBuilder,
    private toaserSerivce: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
    this.geAllManagers();
  }

  get f() {
    return this.managerForm.controls;
  }

  initForm() {
    this.managerForm = this.formBuilder.group({
      name: ['', Validators.required],
    })
  }

  geAllManagers() {
    if (this.ManagerService.managerGetURL) {
      this.allManagers.length = 0;
      this.ManagerService.getAllmanagers().subscribe((res: any) => {
        this.allManagers = res.data;
        console.log(this.allManagers);
      });
    } else {
      if (JSON.parse(localStorage.getItem('manager'))) {
        this.allManagers = JSON.parse(localStorage.getItem('manager'));
        console.log(this.allManagers);
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.managerForm.invalid) {
      this.toaserSerivce.error('Fill All Fields', 'Error');
      return
    }
    if (this.editing) {
      this.updateManager(this.managerForm.value);
    } else {
      this.addManager(this.managerForm.value);
    }
  }

  addManager(manager) {
    if (this.ManagerService.managerAddURL) {
      this.ManagerService.addmanager(manager).subscribe((res: any) => {
        // jQuery('#addManagerModal').modal('hide');
        this.toaserSerivce.success('Manager Added', 'Success!');
        this.allManagers.push(res.data);
        this.resetForm();
      });
    } else {
      this.allManagers.push(manager);
      localStorage.setItem('manager', JSON.stringify(this.allManagers));
      // jQuery('#addManagerModal').modal('hide');
      this.toaserSerivce.success('Manager Added', 'Success!');
      this.resetForm();
    }
  }

  updateManager(manager) {
    if (this.ManagerService.managerUpdateURL) {
      this.ManagerService.updatemanager(this.allManagers[this.selectedManagerIndex]._id, manager).subscribe(res => {
        // jQuery('#addManagerModal').modal('hide');
        this.toaserSerivce.info('Manager Updated Successfully!', 'Updated!');
        this.allManagers.splice(this.selectedManagerIndex, 1, res);
        this.resetForm();
      });
    } else {
      this.allManagers.splice(this.selectedManagerIndex, 1, manager);
      localStorage.setItem('manager', JSON.stringify(this.allManagers));
      // jQuery('#addManagerModal').modal('hide');
      this.toaserSerivce.info('Manager Updated Successfully!', 'Updated!');
      this.resetForm();
    }
  }

  editManager(i) {
    this.editing = true;
    this.selectedManagerIndex = i;
    this.setFormValue();
  }

  setFormValue() {
    const manager = this.allManagers[this.selectedManagerIndex];
    this.managerForm.get('name').setValue(manager.name);
    console.log(this.managerForm.value);
  }

  deleteManager(i) {
    if (this.ManagerService.managerDeleteURL) {
      if (confirm('You Sure you want to delete this Manager')) {
        this.ManagerService.deletemanager(this.allManagers[i]._id)
          .toPromise()
          .then(() => {
            this.allManagers[0].splice(i, 1);
            this.toaserSerivce.warning('Manager Deleted!', 'Deleted!');
          }).catch((err) => console.log(err));
      }
    } else {
      if (confirm('You Sure you want to delete this Manager')) {
        this.allManagers.splice(i, 1);
        localStorage.setItem('manager', JSON.stringify(this.allManagers));
        this.toaserSerivce.warning('Manager Deleted!', 'Deleted!');
      }
    }
  }
  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.managerForm.reset();
    this.initForm();
  }

}
