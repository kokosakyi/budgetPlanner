import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class ProjectService {

    options;
    domain = this.authService.domain;

    constructor(
        private authService: AuthService,
        private http: Http
    ) { }

    // Function to create headers, add token to be used in HTTP requests
    createAuthenticationHeaders() {
        this.authService.loadToken(); // Get token so it can be attached to headers
        // Headers configuration options
        this.options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json', // Format set to JSON object
                'authorization': this.authService.authToken // Attach token
            })
        });
    }

    // Function to create a new project
    newProject(project) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.post(this.domain + 'projects/newProject', project, this.options).map(res => res.json());
    }

    // Function to get all projects from the database
    getAllProjects() {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.get(this.domain + 'projects/allProjects', this.options).map(res => res.json());
    }

    // Function to get the projects using the id
    getSingleProject(id) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.get(this.domain + 'projects/singleProject/' + id, this.options).map(res => res.json());
    }

    // Function to edit/update blog post
    editTotalSavings(project) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.put(this.domain + 'projects/updateTotalSavings/', project, this.options).map(res => res.json());
    }

    // Function to edit/update blog post
    editMonthlySavings(project) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.put(this.domain + 'projects/updateMonthlySavings/', project, this.options).map(res => res.json());
    }

    // Function to post a lineItem for a project
    postLineItem(id, item) {
        this.createAuthenticationHeaders(); // Create headers
        // Create blogData to pass to backend
        const itemData = {
            id: id,
            listItem: item.itemName,
            cost: item.cost
        }
        return this.http.post(this.domain + 'projects/lineItem', itemData, this.options).map(res => res.json());
    }

    updateTotalCost(project) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.put(this.domain + 'projects/updateTotalCost/', project, this.options).map(res => res.json());
    }

    // Function to delete a project
    deleteProject(id) {
        this.createAuthenticationHeaders(); // Create headers
        return this.http.delete(this.domain + 'projects/deleteProject/' + id, this.options).map(res => res.json());
    }

}