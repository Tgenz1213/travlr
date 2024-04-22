/**
 * @file    trip-data.service.ts
 * @brief   This file contains the TripDataService class, which provides data services for trips and authentication.
 *
 * @details The TripDataService class is responsible for handling HTTP requests related to trips and authentication.
 *          It interacts with the backend API to retrieve, create, update, and authenticate trips and users.
 */

import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, lastValueFrom } from "rxjs";

import { Trip } from "../models/trip";
import { User } from "../models/user";
import { AuthResponse } from "../models/authresponse";
import { BROWSER_STORAGE } from "../storage";

/**
 * @class   TripDataService
 * @brief   Provides data services for trips and authentication.
 *
 * @details The TripDataService class handles HTTP requests related to trips and authentication.
 *          It interacts with the backend API to retrieve, create, update, and authenticate trips and users.
 */
@Injectable({ providedIn: "root" })
export class TripDataService {
  private apiBaseUrl = "http://localhost:3000/api";
  private tripUrl = "http://localhost:3000/api/trips";

  /**
   * @brief Constructs an instance of the TripDataService.
   *
   * @param http    The HttpClient instance for making HTTP requests.
   * @param storage The browser's storage object, injected using the BROWSER_STORAGE token.
   */
  constructor(private http: HttpClient, @Inject(BROWSER_STORAGE) private storage: Storage) {}

  /**
   * @brief Retrieves a list of trips from the backend API.
   *
   * @returns An Observable that emits an array of Trip objects.
   */
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  /**
   * @brief Retrieves a specific trip from the backend API.
   *
   * @param tripCode The code of the trip to retrieve.
   * @returns An Observable that emits an array of Trip objects.
   */
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl + "/" + tripCode);
  }

  /**
   * @brief Adds a new trip to the backend API.
   *
   * @param formData The Trip object containing the trip data.
   * @returns An Observable that emits the created Trip object.
   */
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripUrl, formData);
  }

  /**
   * @brief Updates an existing trip in the backend API.
   *
   * @param formData The Trip object containing the updated trip data.
   * @returns An Observable that emits the updated Trip object.
   */
  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(this.tripUrl, formData);
  }

  /**
   * @brief Performs the user login process.
   *
   * @param user The User object containing the user's credentials.
   * @returns A Promise that resolves with an AuthResponse object.
   */
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }

  /**
   * @brief Performs the user registration process.
   *
   * @param user The User object containing the user's registration information.
   * @returns A Promise that resolves with an AuthResponse object.
   */
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }

  /**
   * @brief Makes an API call for authentication.
   *
   * @tparam AuthResponse The type of the expected response object.
   * @param urlPath The URL path for the authentication API endpoint.
   * @param user The User object containing the user's credentials or registration information.
   * @returns A Promise that resolves with an AuthResponse object.
   */
  private async makeAuthApiCall<AuthResponse>(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return (await lastValueFrom(this.http.post(url, user))) as AuthResponse;
  }
}
