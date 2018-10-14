import { Injectable } from '@angular/core';

@Injectable()
export class User {
    name?: string;
    lastName?: string;
    email?: string;
    password?: string;
    username?: string;
    address?: string; // zipcode
    organization?: string;
    totalPoints?: number;
    totalCarbonPoints?: number;
    userType?: string;
    picture?: string;
}
