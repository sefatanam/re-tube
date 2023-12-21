import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMenusComponent } from './mobile-menus.component';

describe('MobileMenusComponent', () => {
  let component: MobileMenusComponent;
  let fixture: ComponentFixture<MobileMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
