class HelloService {
  public sayHello(name: string): string {
    return `Hello ${name}!`;
  }
}

export default new HelloService();