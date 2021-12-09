import * as axios from "axios";

export default class Api {
  constructor() {
    this.api_username = 'dacf1176-6acd-4639-b814-86790e049d74';
    this.api_password = '40744ae6-5e4f-43c5-87e3-25e96b4ed756';
    this.api_url = 'https://api.mjml.io/v1';
  }

  init = () => {
    // this.api_token = getCookie("ACCESS_TOKEN");
    const token = Buffer.from(`${this.api_username}:${this.api_password}`, 'utf8').toString('base64')

    let headers = {
      // Accept: "application/json",
      Authorization: `Basic ${token}`,
      // "Content-Type": "application/x-www-form-urlencoded"
    };

    console.log(headers)

      // headers.Authorization.username = this.api_username;
      // headers.Authorization.password = this.api_password;
   

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers: headers,
    });

    return this.client;
  };



  getHTML = (data) => {
    return this.init().post("/render", data);
  };
}