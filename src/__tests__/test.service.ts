import ApiService from '../api-service';

export default class TestService extends ApiService {
  constructor() {
    super({
      name: 'test',
      baseURL: 'https://gorest.co.in/public-api',
      headers: {}
    });
  }

  async getUsers() {
    return this.get({ path: '/users' });
  }
}
