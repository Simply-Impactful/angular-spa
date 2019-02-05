import { User } from './User';

export class Message {

  user?: User;
  message: string;
  isError?: boolean = false;
  title?: string;
  fsreqId?: string;
  content?: any;
  hasNext?: boolean = false;
  notify?: boolean = false;

  constructor(message: string , isError: boolean , title?: string , fsreqId?: string , content?: any, hasNext?: boolean, notify?: boolean) {
    this.message = message;
    this.title = title ? title : undefined;
    this.isError = isError;
    this.fsreqId = fsreqId ? fsreqId : undefined;
    this.content = content ? content : undefined;
    this.hasNext = hasNext ? hasNext : undefined;
    this.notify = notify ? notify : false;
  }

}


