import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";
import { Trip } from "../models/trip";

@Component({
  selector: "app-trip-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./trip-card.component.html",
  styleUrl: "./trip-card.component.css"
})
export class TripCardComponent implements OnInit {
  @Input("trip") trip: Trip = {} as Trip;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public editTrip(trip: Trip): void {
    localStorage.removeItem("tripCode");
    localStorage.setItem("tripCode", trip.code);
    this.router.navigate(["edit-trip"]);
  }
}
