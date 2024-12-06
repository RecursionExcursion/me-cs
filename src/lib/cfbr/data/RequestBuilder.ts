export class RequestBuilder {
  #baseUrl: string | undefined;
  #route: string | undefined;
  #queryParams: Record<string, string> = {};

  public baseUrl(arg: string) {
    this.#baseUrl = arg;
    return this;
  }

  public route(arg: string) {
    this.#route = arg;
    return this;
  }

  public queryParams(params: Record<string, string>) {
    this.#queryParams = params;
    return this;
  }

  public build(): string {
    return [
      this.#baseUrl,
      this.#route,
      `?${Object.values(this.#queryParams).join("&")}`,
    ].join("");
  }
}
