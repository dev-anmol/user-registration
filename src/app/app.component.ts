import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, AsyncPipe, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements OnInit {
  userObj: USER = new USER();


  http = inject(HttpClient);
  cityList$: Observable<string[]> = new Observable<string[]>();
  stateList$: Observable<string[]> = new Observable<string[]>();
  userList: USER[] = [];
  isEdited: boolean = false;

  ngOnInit(): void {
    this.cityList$ = this.http.get<string[]>('http://localhost:3000/cityList').pipe(
      catchError(err => {
        console.error('Error fetching city list', err);
        return of([]); //creates an observable that emits a single value and if error occurs the observable will emit an empty array instead of propagating the error
      })
    )
    this.stateList$ = this.http.get<string[]>('http://localhost:3000/stateList').pipe(
      catchError(err => {
        console.log('Error fetching city list', err);
        return of([]);
      })
    )
    this.getUsers();
  }
  isEditedBool() {
    this.isEdited != this.isEdited;
  }
  getUsers() {
    this.http.get<USER[]>('http://localhost:3000/userList').subscribe((res: USER[]) => {
      this.userList = res;
    })
  }
  onSaveUser() {
    // this.http.post<USER>('http://localhost:3000/createUser', this.userObj).subscribe((res:USER)=>{
    //   alert("User created successfully")
    // })
    this.http.get<USER>('http://localhost:3000/createUser').subscribe((res: USER) => {
      alert("User created successfully");
      this.userList.unshift(this.userObj); //adding the new user at the beginning of the list
      this.userObj.fName = "";
      this.userObj.LName = "";
      this.userObj.city = "";
      this.userObj.state = "";
      this.userObj.userId = "";
      this.userObj.zipCode = "";
      this.userObj.userName = "";
    })
  }
  deleteUser(user: USER) {
    const index = this.userList.findIndex(item => item.userName === user.userName);
    if (index !== -1) {
      this.userList.splice(index, 1);
    } else {
      console.error('User not found');
    }
  }
  editUser(user: USER) {
    alert('edit through the new user form')
    const existingUser = this.userList.find(item => item.userName === user.userName);
    this.userObj = user;
    if (existingUser) {
      existingUser.fName = this.userObj.fName;
      existingUser.LName = this.userObj.LName;
      existingUser.city = this.userObj.city;
      existingUser.state = this.userObj.state;
      existingUser.zipCode = this.userObj.zipCode;
    } else {
      console.error('User not found');
    }
  }
}

export class USER {
  userId: any;
  userName: string;
  fName: string;
  LName: string;
  city: string;
  state: string;
  zipCode: string;
  constructor() {
    this.userId = 0;
    this.userName = '';
    this.fName = '';
    this.LName = '';
    this.city = '';
    this.state = '';
    this.zipCode = '';
  }

}
