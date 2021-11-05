import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsComponent } from './panels.component';

describe('PanelsComponent', () => {
  let component: PanelsComponent;
  let fixture: ComponentFixture<PanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle method', () => {
    it('should emit true', () => {
      component.toggle(true);

      component.toggleMode.subscribe(boolVal => {
        expect(boolVal).toEqual(true);
      });
    });

    it('should emit false', () => {
      component.toggle(false);

      component.toggleMode.subscribe(boolVal => {
        expect(boolVal).toEqual(false);
      });
    });
  });

});
