export default class ErrorHttp {
  messages: string[];

  constructor(public status: number, msg: string | string[]) {
    this.status = this.status || 500;
    this.messages = Array.isArray(msg) ? msg : [msg];
  }
}
