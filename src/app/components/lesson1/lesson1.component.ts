import { Component, OnInit } from '@angular/core';
import { WasmService } from 'src/app/services/wasm.service';

@Component({
  selector: 'app-lesson1',
  templateUrl: './lesson1.component.html',
  styleUrls: ['./lesson1.component.scss']
})
export class Lesson1Component implements OnInit {
  a = 0;
  b = 0;
  result: number | null = null;

  constructor(private wasm: WasmService) {}

  async ngOnInit(): Promise<void> {
  }

  calculate(): void {
    this.result = this.wasm.add(this.a, this.b);
  }
}
