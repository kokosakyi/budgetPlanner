import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { MdDialog } from '@angular/material';
import { FlashMessagesService } from 'angular2-flash-messages';
import { EditProjectTotalSavingsComponent } from '../edit-project-total-savings/edit-project-total-savings.component';
import { EditProjectMonthlySavingsComponent } from '../edit-project-monthly-savings/edit-project-monthly-savings.component';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  form;
  lineItem: string = '';
  lineCost: number = 0;
  info = [];
  currentUrl;
  message;
  messageClass;
  project = [];
  lineItemsArray;
  processing = false;
  loading = true;
  totalExpensesCost: number = 0;
  dialogRef;
  targetDuration: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    public location: Location,
    public activatedRoute: ActivatedRoute,
    public projectService: ProjectService,
    public dialog: MdDialog,
    private _flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
    this.createForm();
    this.refreshData();
  }

  addItem(id) {
    this.postLineItem(id);
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      itemName: ['', Validators.required], // Item Name field
      cost: ['', Validators.required] // cost field
    });
  }

  goBack() {
    this.location.back();
  }

  editSavings() {
    this.dialogRef = this.dialog.open(EditProjectTotalSavingsComponent, { data: this.project });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.project['totalSavings'] = result;
        this.targetDuration = Math.ceil((this.project['totalCost'] - this.project['totalSavings'] ) / this.project['monthlySavings']);
        this.updateProjectTotalSavings();
      }

    });
  }

  editMSavings() {
    this.dialogRef = this.dialog.open(EditProjectMonthlySavingsComponent, { data: this.project });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.project['monthlySavings'] = result;
        this.targetDuration = Math.ceil((this.project['totalCost'] - this.project['totalSavings'] ) / this.project['monthlySavings']);
        this.updateProjectMonthlySavings();
      }
    });
  }

  

  // Function to Submit Update
  updateProjectTotalSavings() {
    this.processing = true; // Lock form fields
    // Function to send product object to backend
    this.projectService.editTotalSavings(this.project).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        this._flashMessagesService.show('Total Savings amount successfully changed', { cssClass: 'alert-success', timeout: 1500 });
      }
    });
  }

  // upateProjectItems() {
  //   for (let item of this.project['items']) {
  //     console.log(item['cost']);
  //     this.totalExpensesCost += item['cost'];
  //   }
  // }

  // Function to Submit total Monthly Savings
  updateProjectMonthlySavings() {
    this.processing = true; // Lock form fields
    // Function to send product object to backend
    this.projectService.editMonthlySavings(this.project).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
        this._flashMessagesService.show('Monthly Savings not updataed', { cssClass: 'alert-danger', timeout: 1500 });
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        this._flashMessagesService.show('Monthly Savings amount successfully changed', { cssClass: 'alert-success', timeout: 1500 });
      }
    });
  }

  // Function to Submit total Cost
  updateTotalCost() {
    this.processing = true // Lock form fields
    // Function to send prodcuct object to backend
    this.projectService.updateTotalCost(this.project).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
        console.log(this.message);
        this._flashMessagesService.show('Total Cost not updated', { cssClass: 'alert-danger', timeout: 1500 });
      } else {
        this.message = data.message; // Set success message
        console.log(this.message);
        //this._flashMessagesService.show('Total Cost successfully updated', { cssClass: 'alert-success', timeout: 1500} );
      }
    });
  }

  // Function to post a new comment
  postLineItem(id) {
    this.processing = true; // Lock buttons while saving comment to database
    const lineItem = {
      itemName: this.form.get('itemName').value, // Get the lineItem value to pass to service function
      cost: this.form.get('cost').value, // Get the cost value to pass to service function
    };
    // Function to save the lineItem to the database
    this.projectService.postLineItem(id, lineItem).subscribe(data => {
      // Check if request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
        this._flashMessagesService.show(this.message, { cssClass: 'alert-danger', timeout: 1500 });
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        this._flashMessagesService.show(this.message, { cssClass: 'alert-success', timeout: 1500 });
        this.refreshData();
      }
    });
  }

  refreshData() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Function to GET current project with id in params
    this.projectService.getSingleProject(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this._flashMessagesService.show(this.message, { cssClass: 'alert-danger', timeout: 1500 });
      } else {
        this.project = data.project; // Save project object for use in HTML
        //console.log(this.project['items']);
        this.totalExpensesCost = 0;
        for (let item of this.project['items']) {
          this.totalExpensesCost += item['cost'];
        }
        this.project['totalCost'] = this.totalExpensesCost;
        this.targetDuration = Math.ceil((this.project['totalCost'] - this.project['totalSavings'] ) / this.project['monthlySavings']);
        this.updateTotalCost();
        this.loading = false; // Allow loading of project form
      }
    });
  }





}
