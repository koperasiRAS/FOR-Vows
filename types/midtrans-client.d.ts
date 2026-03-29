declare module "midtrans-client" {
  export class CoreApi {
    constructor(config: {
      serverKey: string;
      clientKey: string;
      apiBaseUrl: string;
    });
    charge(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
  }
  export class Snap {
    constructor(config: { openSnapPopup: string });
  }
  export class MidtransError extends Error {
    constructor(message: string);
  }
  export class SnapBiConfig {}
  export class SnapBi {}
  export class Iris {}
}
