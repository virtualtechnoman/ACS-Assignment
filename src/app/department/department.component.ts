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
    this.geAllDepartments();
    this.getAllManagers();
  }

  get f() {
    return this.departmentForm.controls;
  }

  initForm() {
    this.departmentForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  get managerArray() {
    this.departmentForm.addControl('subManagers', new FormArray([
      // new FormControl('manager', new FormControl('', Validators.required)),
      // new FormControl('developers', new FormControl(0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')])),
      // new FormControl('developers', new FormControl(0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')])),
    ]));
    return this.departmentForm.get('subManagers') as FormArray;
  }

  viewDepartment(index) {
    this.selectedDepartmentIndex = index;
    this.selectedDepartment = this.allDepartments[index];
  }

  addSubManager() {
    console.log();
    // if (this.managerArray.length < this.allManagers.length) {
    // this.managerArray[i].subManagers = [];
    console.log(this.departmentForm.value);
    this.managerArray.push(this.formBuilder.group({
      manager: ['', [Validators.required, Validators.minLength(0)]],
      developers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
      testers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
    }));
    console.log(this.departmentForm.value);
    // }
  }

  addDeveloper(departmentIndex, managerIndex) {
    console.log("Department Index : ", departmentIndex + " " + "Manager Index : ", managerIndex)
    if (managerIndex >= 0) {
      this.allDepartments[departmentIndex].subManagers[managerIndex].developers++;
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    } else {
      this.allDepartments[departmentIndex].developers++;
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    }
    this.selectedDepartment = this.allDepartments[departmentIndex];
  }

  addTester(departmentIndex, managerIndex) {
    if (managerIndex >= 0) {
      this.allDepartments[departmentIndex].subManagers[managerIndex].testers++;
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    } else {
      this.allDepartments[departmentIndex].testers++;
      localStorage.setItem('department', JSON.stringify(this.allDepartments));
      this.geAllDepartments();
    }
    this.selectedDepartment = this.allDepartments[departmentIndex];
  }

  addNestedSubManager(i) {
    console.log(i);
    console.log(this.managerArray.controls[i].value);
    this.managerArray.push(this.formBuilder.group({
      manager: ['', [Validators.required, Validators.minLength(0)]],
      developers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]],
      testers: [0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]]
    }));
    console.log(this.departmentForm.value);
  }

  addManager() {
    this.departmentForm.addControl('manager', new FormControl('', Validators.required));
    this.departmentForm.addControl('developers', new FormControl(0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]));
    this.departmentForm.addControl('testers', new FormControl(0, [Validators.required, Validators.max(999), Validators.min(0), Validators.maxLength(3), Validators.minLength(0), Validators.pattern('^[0-9]+$')]));
    console.log(this.departmentForm.value);
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
        // jQuery('#modal3').modal('hide');
        this.toaserSerivce.success('Department Added', 'Success!');
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

  calculateDevelopers(i) {
    let developers = this.allDepartments[i].developers;
    if (i >= 0) {
      if (this.allDepartments[i].subManagers.length <= 1) {
        var sum = this.allDepartments[i].subManagers.reduce(function (sum: number, elem) {
          console.log(developers);
          // sum + elem.developers;
          return developers = Number(developers) + Number(sum);
        }, 0);
      } else {
        var sum = this.allDepartments[i].subManagers.reduce((a, b) => +a + +(b['developers']), 0);
        developers = Number(sum) + Number(developers);
        return developers
      }
    }
  }

  calculateTesters(i) {
    if (i >= 0) {
      let testers = this.allDepartments[i].testers;
      if (this.allDepartments[i].subManagers.length <= 1) {
        var sum = this.allDepartments[i].subManagers.reduce(function (sum: number, elem) {
          return sum + elem.testers;
        }, 0);
        return testers = Number(testers) + Number(sum);
      } else {
        var sum = this.allDepartments[i].subManagers.reduce((a, b) => +a + +(b['testers']), 0);
        return testers = + testers + +sum;
      }
    }
  }

  calculateManagers(i) {
    const count2 = this.allDepartments[i].subManagers.filter((manager) => manager).length + 1;
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
}
