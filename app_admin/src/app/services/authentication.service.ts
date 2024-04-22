/**
 * @file    authentication.service.ts
 * @brief   This file contains the AuthenticationService class, which provides authentication-related functionality.
 *
 * @details The AuthenticationService class is responsible for handling user authentication, including login, registration,
 *          token management, and user information retrieval. It interacts with the TripDataService and utilizes the
 *          browser's storage to store and retrieve authentication tokens.
 */

import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../storage";
import { User } from "../models/user";
import { AuthResponse } from "../models/authresponse";
import { TripDataService } from "./trip-data.service";

/**
 * @class     AuthenticationService
 * @brief     Provides authentication-related functionality.
 *
 * @details   The AuthenticationService class handles user authentication, including login, registration, token management,
 *            and user information retrieval. It interacts with the TripDataService and utilizes the browser's storage to
 *            store and retrieve authentication tokens.
 */
@Injectable({ providedIn: "root" })
export class AuthenticationService {
  /**
   * @brief   Constructs an instance of the AuthenticationService.
   *
   * @param storage         The browser's storage object, injected using the BROWSER_STORAGE token.
   * @param tripDataService The TripDataService instance.
   */
  constructor(@Inject(BROWSER_STORAGE) private storage: Storage, private tripDataService: TripDataService) { }

  /**
   * @brief   Retrieves the authentication token from the browser's storage.
   *
   * @returns The authentication token as a string, or null if not found.
   */
  public getToken(): string | null {
    return this.storage.getItem("travlr-token");
  }

  /**
   * @brief   Saves the authentication token in the browser's storage.
   *
   * @param token The authentication token to be saved.
   */
  public saveToken(token: string): void {
    this.storage.setItem("travlr-token", token);
  }

  /**
   * @brief   Performs the user login process.
   *
   * @param user The User object containing the user's credentials.
   * @returns A Promise that resolves with an unknown value.
   */
  public login(user: User): Promise<unknown> {
    return this.tripDataService.login(user).then((authResp: AuthResponse) => this.saveToken(authResp.token));
  }

  /**
   * @brief   Performs the user registration process.
   *
   * @param user The User object containing the user's registration information.
   * @returns A Promise that resolves with an unknown value.
   */
  public register(user: User): Promise<unknown> {
    return this.tripDataService.register(user)
      .then((authResp: AuthResponse) =>
        this.saveToken(authResp.token));
  }

  /**
   * @brief Logs out the current user by removing the authentication token from the browser's storage.
   */
  public logout(): void {
    this.storage.removeItem("travlr-token");
  }

  /**
   * @brief Checks if the user is currently logged in.
   *
   * @returns True if the user is logged in and the token has not expired, false otherwise.
   */
  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();

    if (token === null) {
      return false;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > (Date.now() / 1000);
  }

  /**
   * @brief Retrieves the current user's information.
   *
   * @returns The User object containing the current user's information, or null if the user is not logged in.
   */
  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const token: string | null = this.getToken();

    if (token === null) {
      return null;
    }

    const { email, name } = JSON.parse(atob(token.split(".")[1]));
    return { email, name } as User;
  }
}
