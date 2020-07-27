import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DepartmentService } from '../shared/services/department-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ManagerService } from '../shared/services/manager-service.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  allDepartments: any[] = [];
  allManagers: any[] = [];
  editing: boolean = false;
  departmentForm: FormGroup;
  newManager = {
    manager: '', developers: 0, testers: 0
  }
  newManagerIndex;
  newManagerForm: FormGroup;
  submitted: boolean = false;
  selectedDepartment: any;
  selectedDepartmentIndex: number;
  totalArray: any[] = [];
  uploading: boolean = false;

  constructor(private departmentService: DepartmentService, private formBuilder: FormBuilder,
    private toaserSerivce: ToastrService, private managerService: ManagerService, private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initForm();
    this.initNewManagerForm();
    this.geAllDepartments();
    this.getAllManagers();
  }

  get f() {
    return this.departmentForm.controls;
  }

  get f2() {
    return this.newManagerForm.controls;
  }

  initForm() {
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required],
      manager: ['', [Validators.required, Validators.minLength(0)]],
      developers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
      testers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
    })
  }

  initNewManagerForm() {
    this.newManagerForm = this.formBuilder.group({
      manager: ['', [Validators.required, Validators.minLength(0)]],
      developers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
      testers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
    })
  }

  viewDepartment(index) {
    this.selectedDepartmentIndex = index;
    this.selectedDepartment = this.allDepartments[index];
  }


  addDeveloper(departmentIndex, managerIndex) {
    console.log("Department Index : ", departmentIndex + " " + "Manager Index : ", managerIndex)
    if (managerIndex >= 0) {
      this.allDepartments[departmentIndex].subManagers[managerIndex].developers++;
      this.toaserSerivce.success('Developer Added under' + this.allDepartments[departmentIndex].subManagers[managerIndex].manager, 'Success!');
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    } else {
      this.allDepartments[departmentIndex].developers++;
      this.toaserSerivce.success('Developer Added under' + this.allDepartments[departmentIndex].manager, 'Success!');
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    }
    this.selectedDepartment = this.allDepartments[departmentIndex];
  }

  addTester(departmentIndex, managerIndex) {
    if (managerIndex >= 0) {
      this.allDepartments[departmentIndex].subManagers[managerIndex].testers++;
      this.toaserSerivce.success('Tester Added under' + this.allDepartments[departmentIndex].subManagers[managerIndex].manager, 'Success!');
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    } else {
      this.allDepartments[departmentIndex].testers++;
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.toaserSerivce.success('Tester Added under' + this.allDepartments[departmentIndex].manager, 'Success!');
      this.geAllDepartments();
    }
    this.selectedDepartment = this.allDepartments[departmentIndex];
  }

  geAllDepartments() {
    if (this.departmentService.departmentGetEndpoint) {
      this.allDepartments.length = 0;
      this.departmentService.getAllDepartments().subscribe((res: any) => {
        this.allDepartments = res.data;
        console.log(this.allDepartments);
      });
    } else {
      if (JSON.parse(localStorage.getItem('department'))) {
        this.allDepartments = JSON.parse(localStorage.getItem('department'));
        for (let index = 0; index < this.allDepartments.length; index++) {
          this.calculateTotal(index)
        }
        console.log("All Departments:", this.allDepartments);
      }
    }
  }

  getAllManagers() {
    if (this.managerService.managerGetURL) {
      this.allManagers.length = 0;
      this.managerService.getAllmanagers().subscribe((res: any) => {
        this.allManagers = res.data;
        console.log(this.allManagers);
      });
    } else {
      if (JSON.parse(localStorage.getItem('manager'))) {
        this.allManagers = JSON.parse(localStorage.getItem('manager'));
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.uploading = true;
    if (this.departmentForm.invalid) {
      console.log(this.departmentForm);
      console.log(this.departmentForm.value);
      this.toaserSerivce.error('Fill All Fields', 'Error');
      return
    }
    if (this.editing) {
      this.updateDepartment(this.departmentForm.value);
    } else {
      this.addDepartment(this.departmentForm.value);
    }
  }

  addDepartment(department) {
    if (this.departmentService.departmentAddEndpoint) {
      this.departmentService.addDepartment(department).subscribe((res: any) => {
        jQuery('#addDepartmentModal').modal('hide');
        this.allDepartments.push(res.data);
        this.resetForm();
      });
    } else {
      this.allDepartments.push(department);
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.resetForm();
      this.geAllDepartments();
      console.log(this.allDepartments);
    }
    jQuery('#addDepartmentModal').modal('hide');
    this.toaserSerivce.success('Department Added Successfully!', 'Success!');
  }

  updateDepartment(department) {
    if (this.departmentService.departmentUpdateEndpoint) {
      this.departmentService.updateDepartment(this.allDepartments[this.selectedDepartmentIndex]._id, department).subscribe(res => {
        // jQuery('#modal3').modal('hide');
        this.toaserSerivce.info('Department Updated Successfully!', 'Updated!');
        this.allDepartments.splice(this.selectedDepartmentIndex, 1, res);
        this.resetForm();
      });
    } else {
      this.allDepartments.splice(this.selectedDepartmentIndex, 1, department);
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
    }
  }

  editDepartment(i) {
    this.editing = true;
    this.selectedDepartmentIndex = i;
    this.setFormValue();
  }

  setFormValue() {
    const department = this.allDepartments[this.selectedDepartmentIndex];
    this.departmentForm.get('name').setValue(department.name);
    console.log(this.departmentForm.value);
  }

  deleteDepartment(i) {
    if (this.departmentService.departmentDeleteEndpoint) {
      if (confirm('You Sure you want to delete this Department')) {
        this.departmentService.deleteDepartment(this.allDepartments[i]._id)
          .toPromise()
          .then(() => {
            this.allDepartments[0].splice(i, 1);
            this.toaserSerivce.warning('Department Deleted!', 'Deleted!');
          }).catch((err) => console.log(err));
      }
    } else {
      if (confirm('You Sure you want to delete this Department')) {
        this.allDepartments.splice(i, 1);
        localStorage.setItem('department', JSON.stringify(this.allDepartments));
        this.toaserSerivce.warning('Department Deleted!', 'Deleted!');
      }
    }
  }

  resetForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.departmentForm.reset();
    this.initForm();
  }
  resetManagerForm() {
    this.editing = false;
    this.submitted = false;
    this.uploading = false;
    this.newManagerForm.reset();
    this.initNewManagerForm();
  }

  calculateDevelopers(i) {
    if (typeof i === 'number') {
      let developers = this.allDepartments[i].developers;
      if (this.allDepartments[i].subManagers) {
        if (this.allDepartments[i].subManagers.length <= 1) {
          var sum = this.allDepartments[i].subManagers.reduce(function (sum: number, elem) {
            // sum + elem.developers;
            return developers = Number(developers) + Number(sum);
          }, 0);
        } else {
          console.log(this.allDepartments[i].subManagers);
          var sum = this.allDepartments[i].subManagers.reduce((a, b) => +a + +(b['developers']), 0);
          developers = Number(sum) + Number(developers);
          return developers
        }
      } else {
        return developers;
      }
    }
  }

  calculateTesters(i) {
    if (typeof i === 'number') {
      let testers = this.allDepartments[i].testers;
      if (this.allDepartments[i].subManagers) {
        if (this.allDepartments[i].subManagers.length <= 1) {
          var sum = this.allDepartments[i].subManagers.reduce(function (sum: number, elem) {
            return sum + elem.testers;
          }, 0);
          return testers = Number(testers) + Number(sum);
        } else {
          var sum = this.allDepartments[i].subManagers.reduce((a, b) => +a + +(b['testers']), 0);
          return testers = + testers + +sum;
        }
      } else return testers;
    }
  }

  calculateManagers(i) {
    let count2 = 1;
    if (this.allDepartments[i].subManagers) {
      count2 = this.allDepartments[i].subManagers.filter((manager) => manager).length + 1;
    }
    return count2;
  }

  calculateTotal(i) {
    // console.log('INDEX:', i + " " + this.calculateDevelopers(i));
    let total = 0;
    // if(this.selectedDepartment.subManagers.length = 1)
    total = (1000 * this.calculateDevelopers(i)) + (500 * this.calculateTesters(i) + (300 * this.calculateManagers(i)));
    const obj = {
      developers: this.calculateDevelopers(i), testers: this.calculateTesters(i), total: total
    }
    this.totalArray.splice(i, 1, obj);
    this.ref.detectChanges();
  }

  getManager(i) {
    console.log(typeof i)
    if (typeof i === 'number') {
      console.log(this.allDepartments[this.selectedDepartmentIndex].subManagers[i]);
      this.newManagerIndex = i;
    } else {
      this.newManagerIndex = undefined;
    }
  }

  saveSubmanager() {
    if (typeof this.newManagerIndex === 'number') {
      console.log(this.newManagerIndex);
      this.allDepartments[this.selectedDepartmentIndex].subManagers[this.newManagerIndex].subManagers = [];
      this.allDepartments[this.selectedDepartmentIndex].subManagers[this.newManagerIndex].subManagers.push(this.newManagerForm.value)
      this.toaserSerivce.success('Department Added Successfully under ' + this.allDepartments[this.selectedDepartmentIndex].subManagers[this.newManagerIndex].manager, 'Success!');
    } else {
      if (this.allDepartments[this.selectedDepartmentIndex].subManagers && this.allDepartments[this.selectedDepartmentIndex].subManagers.length > 0) {
        this.allDepartments[this.selectedDepartmentIndex].subManagers.push(this.newManagerForm.value);
        this.toaserSerivce.success('Department Added Successfully under ' + this.allDepartments[this.selectedDepartmentIndex].manager, 'Success!');
      } else {
        console.log(this.newManagerIndex);
        this.allDepartments[this.selectedDepartmentIndex].subManagers = [];
        this.allDepartments[this.selectedDepartmentIndex].subManagers.push(this.newManagerForm.value);
        this.toaserSerivce.success('Manager Added Successfully under ' + this.allDepartments[this.selectedDepartmentIndex].manager, 'Success!');
      }
    }
    
    jQuery('#addManagerModal').modal('hide');
    localStorage.removeItem('department');
    localStorage.setItem('department', JSON.stringify(this.allDepartments));
    console.log(this.allDepartments);
    this.resetManagerForm();
    this.geAllDepartments();
  }

}
