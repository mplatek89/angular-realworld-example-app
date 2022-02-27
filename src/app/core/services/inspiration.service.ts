import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SKIP_TOKEN } from "..";
import { environment } from "../../../environments/environment";
import { Inspiraton } from "../models/inspiration.model";

const context = new HttpContext().set(SKIP_TOKEN, true);
@Injectable({
  providedIn: "root"
})
export class InspirationService {
  constructor(private http: HttpClient) {}

  getQuote(): Observable<Inspiraton> {
    return this.http
      .get<Inspiraton>(`${environment.cat_facts_url}/facts/random`, { context })
  }
}
