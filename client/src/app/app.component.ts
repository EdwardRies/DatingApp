import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;
  count: number;

  constructor(private http: HttpClient) {
    this.count = 0;
  }
  
  ngOnInit(): void {
    this.getUsers();
    this.clock();
  }
  
  getUsers() { 
    this.http.get('https://localhost:5001/api/users')
    .subscribe(response => { this.users = response; }, error => { console.log(error); });
  }
  
  clock() { 
    setInterval(callBack => { this.clockIncrement() }, 1000);
  }

  clockIncrement(): number {
    return this.count++;
  }

}
