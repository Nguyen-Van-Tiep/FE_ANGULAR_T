import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-profile-customer',
  templateUrl: './profile-customer.component.html',
  styleUrls: ['./profile-customer.component.css'],
})
export class ProfileCustomerComponent implements OnInit {
  userInfo: UserInfoResponse = new UserInfoResponse();
  isDisable: boolean = true;
  isValid: boolean = true;
  maxDate: Date = new Date();

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  edit() {
    this.isDisable = false; // Enable edit mode
  }

  cancel() {
    this.isDisable = true; // Exit edit mode
    // Optionally reset form fields or handle other cancellation logic
  }
}
