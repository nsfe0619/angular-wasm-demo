import { Component } from '@angular/core';
import { WasmService } from './services/wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-wasm-demo';
    constructor(private wasm: WasmService) {}
  async ngOnInit(): Promise<void> {
    await this.wasm.init();
  }

}
