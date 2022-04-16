export default {
    NewId: {
        limit: 6,
        period: 36e5
    },
    DiscordLogin: {
        limit: 20,
        period: 60e4
    },
    ConnectionAttempts: {
        limit: 15,
        period: 30e3,
    },
    Violations: {
        limit: 5,
        period: 60e3
    },
    Kickban: {
        limit: 4,
        period: 4e3
    },
    Chown: {
        limit: 4,
        period: 4e3
    },
    Chset: {
        limit: 4,
        period: 4e3
    },
    Chat: {
        Normal: {
            limit: 4,
            period: 6e3
        },
        Crowned: {
            limit: 10,
            period: 2e3
        }
    },
    Note: {
        Lobby: {
            limit: 360,
            period: 6e3
        },
        Normal: {
            limit: 1_800,
            period: 6e3
        },
        Crown: {
            limit: 2_700,
            period: 6e3
        }
    },
    Mouse: {
        limit: 10,
        period: 500
    },
    Userset: {
        limit: 8,
        period: 72e4
    },
    ChangeChannel: {
        limit: 4,
        period: 4e3
    },
    RoomList: {
        limit: 3,
        period: 4e3
    },
    Custom: {
        limit: 16_384,
        period: 10e3
    },
    Data: {
        limit: 15e4,
        period: 10e3
    },
    Message: {
        limit: 1e3,
        period: 10e3
    }
}