/**
 * The main starting point for any application using LabrinthJS.
 */
export default class Client {
    public readonly origin: string = "https://api.modrinth.com/v2";
    public userAgent: string = "labrinthjs";
    public authToken: string;

    constructor(
        options: {
            userAgent: string,
            authToken: string,
        }
    ) {
        this.userAgent = options.userAgent;
        this.authToken = options.authToken;
    }
}