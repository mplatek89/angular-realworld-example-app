import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, finalize, map, of, tap, throwError } from "rxjs";

import { Article, ArticlesService } from "../core";
import { Inspiraton } from "../core/models/inspiration.model";
import { InspirationService } from "../core/services/inspiration.service";

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit {
  article: Article = {} as Article;
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: Object = {};
  isSubmitting = false;
  isInspiredError = false;

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private inspirationService: InspirationService
  ) {
    // use the FormBuilder to create a form group
    this.articleForm = this.fb.group({
      title: "",
      description: "",
      body: ""
    });

    // Initialized tagList as empty array
    this.article.tagList = [];

    // Optional: subscribe to value changes on the form
    // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
  }

  ngOnInit() {
    // If there's an article prefetched, load it
    this.route.data.subscribe((data: { article: Article }) => {
      if (data.article) {
        this.article = data.article;
        this.articleForm.patchValue(data.article);
        this.cd.markForCheck();
      }
    });
  }

  trackByFn(index, item) {
    return index;
  }

  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (this.article.tagList.indexOf(tag) < 0) {
      this.article.tagList.push(tag);
    }
    // clear the input
    this.tagField.reset("");
  }

  removeTag(tagName: string) {
    this.article.tagList = this.article.tagList.filter(tag => tag !== tagName);
  }

  submitForm() {
    this.isSubmitting = true;

    // update the model
    this.updateArticle(this.articleForm.value);

    // post the changes
    this.articlesService.save(this.article).subscribe(
      article => {
        this.router.navigateByUrl("/article/" + article.slug);
        this.cd.markForCheck();
      },
      err => {
        this.errors = err;
        this.isSubmitting = false;
        this.cd.markForCheck();
      }
    );
  }

  updateArticle(values: Object) {
    Object.assign(this.article, values);
  }

  getInspired() {
    this.isInspiredError = false;
    this.inspirationService
      .getQuote()
      .pipe(
        map((response: Inspiraton) => {
          this.articleForm.get("body").setValue(response.text);
        }),
        catchError(err => {
          this.isInspiredError = true;
          return of(err);
        }),
        finalize(() => this.cd.markForCheck())
      )
      .subscribe();
  }
}
