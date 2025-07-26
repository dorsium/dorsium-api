export class InternalNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalNetworkError';
  }
}

export class InternalResponseError extends Error {
  status: number;
  constructor(status: number) {
    super(`Internal service error: ${status}`);
    this.name = 'InternalResponseError';
    this.status = status;
  }
}

export class InternalParseError extends Error {
  constructor() {
    super('Invalid JSON response');
    this.name = 'InternalParseError';
  }
}
