// Angular
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, OnInit, ElementRef, ViewChild, NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Socket.io Client
import * as io from 'socket.io-client';

// Zone.js
import 'zone.js/dist/zone';

// Reflect metadata
import 'reflect-metadata';

// Message interface
import { IMessage } from './message.interface';

// Import data
// import * as data from './data';

// Production mode
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}

// AppComponent
@Component({
  selector: 'body',
  template: `
    <ul class="messages">
      <li class="messages-item" *ngFor="let message of messages">
        <span class="messages-item-field messages-item-field-dyno">{{message.dyno}}</span>
        <span class="messages-item-field messages-item-field-time">{{message.time}}</span>
        <span class="messages-item-field messages-item-field-nick">{{message.nick}}</span>
        <span class="messages-item-field messages-item-field-message">{{message.message}}</span>
      </li>        
    </ul>
    <div class="spacer" [ngStyle]="{'height': spacerHeight}"></div>
    <div class="box" #box>
      <input class="box-input box-input-nickname" autocomplete="off" placeholder="Nick" [(ngModel)]="nick">
      <input class="box-input box-input-message" autocomplete="off" placeholder="Message" [(ngModel)]="message" (keypress)="eventHandler($event)">
      <button class="box-button" (click)="sendMessage()">Send</button>
    </div>
  `,
  styles: [`
    :host {
      padding: 0;
      margin: 0;
    }

    .box {
      border-top: 1px solid black;
      background-color: #FF9900;
      padding: 0.5em;
      position: fixed;
      bottom: 0;
      width: 100%;
    }

    .box-input {
      padding: 0.25em;
    }

    .box-input-nickname, .box-input-message {
      font-size: 1.2em;
      margin-right: 0.5em;
    }

    .box-input-nickname {
      font-size: 1.2em;
      width: 4em;
    }

    .box-input-message {
      font-size: 1.2em;
      width: calc(100% - 11.5em);
    }

    .box-button {
      font-size: 1em;
      width: 4em;
      margin: 0;
      height: 2.3em;
    }

    .messages {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    .messages-item {
      padding: 0.5em;
    }

    .messages-item:nth-child(even) {
      background-color: #CCFFCC;
    }

    .messages-item:nth-child(odd) {
      background-color: #FFCCFF;
    }

    .messages-item-field {
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.25em;
    }

    .messages-item-field-dyno, .messages-item-field-dyno-time {
      color: rgba(128, 0, 0, 0.5);
      font-size: 0.8em;
      font-weight: bold;
    }

    @media only screen and (max-width: 500px) {
      .messages-item-field-dyno, .messages-item-field-time {
        width: calc(50% - 0.5em);
      }
    }

    .messages-item-field-nick {
      color: white;
      background-color: rgba(0, 0, 0, 0.75);
      font-size: 0.8em;
      font-weight: bold;
      letter-spacing: 1px;
      padding: 0.25em 0.5em;
      border-radius: 0.25em;
    }

    .messages-item-field-message {
      font-size: 1em;
    }
  `]
})
class AppComponent implements OnInit {
  @ViewChild('box') private box: ElementRef;
  socket: SocketIOClient.Socket;
  nick: string = '';
  message: string = '';
  messages: IMessage[] = [];
  spacerHeight: string = '55px';

  constructor(private element: ElementRef) {
    const host = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    this.socket = io.connect(host);
    this.socket.on('chat message', this.onChatMessage.bind(this));
    // const smallData = data.getSmallData();
    // const largeData = data.getLargeData();
  }

  ngOnInit() {
    this.setSpacerHeight();
  }

  sendMessage(): void {
    const nick = `${this.nick}`;
    const message = `${this.message}`;
    this.socket.emit('chat message', { nick, message });
    this.message = '';
  }

  eventHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  private onChatMessage(msg: IMessage): void {
    this.messages.push(msg);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom(): void {
    const element = this.element.nativeElement;
    try {
      document.documentElement.scrollTop = element.scrollHeight;
    } catch(error) {
      console.log('ERROR:', error);
    }
  }

  private setSpacerHeight(): void {
    const element = this.box.nativeElement;
    try {
      this.spacerHeight = `${element.scrollHeight}px`;
    } catch(error) {
      this.spacerHeight = '55px';
      console.log('ERROR:', error);
    }
  }
}

// AppModule
@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
class AppModule {}

// Bootstrapo
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));