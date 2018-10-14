import { Injectable } from '@angular/core';

const _window: Window = window;

@Injectable()
export class WindowWrapper extends Window {}

export function GetWindow() { return _window; }
