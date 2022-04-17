export const NewId = {
    limit: 6,
    period: 36e5
};

export const DiscordLogin = {
    limit: 20,
    period: 60e4
};

export const ConnectionAttempt = {
    limit: 15,
    period: 30e3,
};

export const Violations = {
    limit: 5,
    period: 60e3
};

export const Kickban = {
    limit: 4,
    period: 4e3
};

export const Chown = {
    limit: 4,
    period: 4e3
};

export const Chset = {
    limit: 4,
    period: 4e3
};

export const Chat = {
    Normal: {
        limit: 4,
        period: 6e3
    },
    Crowned: {
        limit: 10,
        period: 2e3
    }
};

export const Note = {
    Lobby: {
        limit: 360,
        period: 6e3
    },
    Normal: {
        limit: 1800,
        period: 6e3
    },
    Crown: {
        limit: 2700,
        period: 6e3
    }
};

export const Mouse = {
    limit: 10,
    period: 500
};

export const Userset = {
    limit: 8,
    period: 72e4
};

export const ChangeChannel = {
    limit: 4,
    period: 4e3
};

export const RoomList = {
    limit: 3,
    period: 4e3
};

export const Custom = {
    limit: 16384,
    period: 10e3
};

export const Data = {
    limit: 15e4,
    period: 10e3
};

export const Message = {
    limit: 1e3,
    period: 10e3
};