export const HttpResponseCodes = {
    BadRequest: 400,
    ToManyRequests: 429,
};

export const WebSocketResponseCodes = {
    ServerClosing: 4000,
    TooManyUniqueUsersPerHour: 4001,
    TooManyBytes: 4002,
    MessageBufferLengthExceeded: 4003,
    TimedOut: 4004,
    TooManyMessages: 4007,
    Banned: 4008,
    ClientLimitReached: 4009,
};
