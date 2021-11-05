import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import HomepageComponent from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle method', () => {
    it('should change the state of the toggle', () => {
      expect(component.signupMode).toBeFalsy();
      component.toggle(true);
      expect(component.signupMode).toBeTruthy();
    });
  });

  describe('scroll method', () => {
    let $element = {
      scrollIntoView: jest.fn((obj: Object) => obj)
    };

    it('should scroll some element into the view' , () => {
      component.scroll($element);
      expect($element.scrollIntoView).toHaveBeenCalledWith({behavior: "smooth", block: "start", inline: "nearest"});
    });
  });
});
