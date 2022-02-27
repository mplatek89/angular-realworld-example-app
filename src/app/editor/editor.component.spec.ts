import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { EditorComponent } from "./editor.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { InspirationService } from "../core/services//inspiration.service";
import { of, throwError } from "rxjs";

let component: EditorComponent;
let fixture: ComponentFixture<EditorComponent>;
let mockInspirationService: InspirationService;

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      ReactiveFormsModule
    ],
    declarations: [EditorComponent]
  });

  fixture = TestBed.createComponent(EditorComponent);
  component = fixture.componentInstance;
});

describe("Editor component", () => {
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("setInspired", () => {
    it("Should add random cat fact to article body", fakeAsync(() => {
      const dummyCatFact =
        "Cat owners are 25% likely to pick George Harrison as their favorite Beatle.";

      mockInspirationService = TestBed.inject(InspirationService);
      spyOn(mockInspirationService, "getQuote").and.returnValue(
        of({ text: dummyCatFact })
      );
      component.getInspired();

      tick();

      expect(component.articleForm.get("body").value).toEqual(dummyCatFact);
    }));

    it("Should toggle error flag", fakeAsync(() => {
      mockInspirationService = TestBed.inject(InspirationService);
      spyOn(mockInspirationService, "getQuote").and.returnValue(
        throwError(() => new Error("API Error"))
      );
      component.getInspired();

      tick();

      expect(component.isInspiredError).toBeTrue();
    }));
  });
});
