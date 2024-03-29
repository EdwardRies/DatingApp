import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-errors-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})

export class TestErrorsComponent implements OnInit {
  baseUrl = 'https://localhost:44389/api/';
  validationErrors: string[] = [];
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found')
      .subscribe(response => { },
        error => { console.log(error); })
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request')
      .subscribe(response => { },
        error => { console.log(error); })
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error')
      .subscribe(response => { },
        error => { console.log(error); })
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth')
      .subscribe(response => { },
        error => { console.log(error); })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {})
      .subscribe(response => { },
        error => {
          console.log(error);
          this.validationErrors = error;
        })
  }

}
