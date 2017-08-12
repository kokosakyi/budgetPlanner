import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  form;
  processing = false;
  username;
  message;
  messageClass;


  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public projectService: ProjectService,
    public router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new blog posts and comments
    });
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])], // Item Name field
      totalSavings: ['', Validators.compose([
        Validators.required,
        this.numberAndDecimalValidation
      ])],  // Total Savings field
      monthlySavings: ['', Validators.compose([
        Validators.required,
        this.numberAndDecimalValidation
      ])] // Monthly Savings field
    });
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  // Validation for numbers including decimals
  numberAndDecimalValidation(controls) {
    const regExp = new RegExp(/^[0-9]\d*(\.\d+)?$/); // Regular expression to perform test
    // Check if test returns true or false
    if (regExp.test(controls.value)) {
      return null; // Return valid
    }
    else {
      return { 'numberAndDecimalValidation': true } // Return error in validation
    }
  }

  // Disable project form
  disableForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('totalSavings').disable(); // Disable total savings field
    this.form.get('monthlySavings').disable(); // Disable monthly savings field
  }

   // Enable project form
  EnableForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('totalSavings').enable(); // Enable total savings field
    this.form.get('monthlySavings').enable(); // Enable monthly savings field
  }

  AddProject() {
    this.processing = true; // Disable submit button
    this.disableForm(); // Lock form
    const project = {
      title: this.form.get('title').value, // Title field,
      totalSavings: this.form.get('totalSavings').value, // Savings field,
      monthlySavings: this.form.get('monthlySavings').value, // Monthly savings fields,
      createdBy: this.username // CreatedBy field
    };

    // Function to save project in database
    this.projectService.newProject(project).subscribe(data => {
      // Check if project was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.EnableForm(); // Enable form
      }
      else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        // Clear form data after two seconds
        setTimeout(() => {
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.EnableForm(); // Enable the form fields
          this.router.navigate(['/projects']);
        }, 2000);

      }
    });

  }



}




