import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSHKeysComponent } from './sshkeys.component';

describe('SSHKeysComponent', () => {
  let component: SSHKeysComponent;
  let fixture: ComponentFixture<SSHKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SSHKeysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SSHKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
