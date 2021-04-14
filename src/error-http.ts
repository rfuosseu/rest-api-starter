export default class ErrorHttp extends Error {
  messages: string[];

  name: string = 'ErrorHttp';

  constructor(public status: number, msg: string | string[]) {
    super(msg.toString());
    this.messages = Array.isArray(msg) ? msg : [msg];
  }
}
