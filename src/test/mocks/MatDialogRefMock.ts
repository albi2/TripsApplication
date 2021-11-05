import { DialogPosition, MatDialogRef, MatDialogState, _MatDialogContainerBase } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SignupDialogComponent } from "src/app/components/signup-dialog/signup-dialog.component";

export default class MatDialogRefMock extends MatDialogRef<SignupDialogComponent, any> {
    _containerInstance: _MatDialogContainerBase;
    id: string;
    componentInstance: SignupDialogComponent;
    disableClose: boolean;
    constructor() {
        super(null, null, "1");
    }
    
}