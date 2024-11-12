import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoFormComponent } from './movimiento-form.component';

describe('MovimientoFormComponent', () => {
  let component: MovimientoFormComponent;
  let fixture: ComponentFixture<MovimientoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
