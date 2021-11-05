import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models/User';
import {MatDialog} from '@angular/material/dialog';
import { UserCreationDTO } from 'src/app/models/UserCreationDTO';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { PagedResponse } from 'src/app/models/PagedResponse';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'roles', 'requests'];
  dataSource: User[];
  page: number = 0;
  size: number = 10;
  totalCount: number = 0;

  constructor(private adminService: AdminService, private dialog: MatDialog,
    private authService: AuthService, private _snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((res: PagedResponse<User>) => {
      this.dataSource = res.content;
      this.totalCount = res.totalCount;
    },
    err => {
      console.log(err);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignupDialogComponent);

    dialogRef.afterClosed().subscribe( (result: UserCreationDTO) => {
        if(!!result) {
          this.authService.createUser(result).subscribe((res: User) => {
            this.totalCount++;
            if( this.dataSource.length < this.size){
              this.dataSource.push(res);
              this.dataSource = [...this.dataSource];
            }
            this.openSnackbar("User has been added!", "Dismiss")
          },
          err => {
            this.openSnackbar("Something went wrong! Please try again!", "Dismiss");
          });
        }
    });
  }

  public openSnackbar(message: string, action: string) {
    this._snackBar.open(message,action, {
      duration: 3000
    });
  }

  loadUsers(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;

    this.refreshUsers(this.page, this.size);
  }

  private refreshUsers(page?: number, size?: number) {
    this.adminService.getUsers(page, size).subscribe((res: PagedResponse<User>) => {
      this.dataSource = !!res.content ? res.content : [];
      this.totalCount = !!res.totalCount ? res.totalCount : 0;
    },
    err => {
      console.log(err);
    });
  }
}

