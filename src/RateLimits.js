import RateLimit from "./RateLimit";
import {
    Chat,
    Note,
    // Data,
    // NewId,
    Chown,
    Chset,
    Mouse,
    // Custom,
    Kickban,
    Userset,
    // Message,
    RoomList,
    // Violations,
    // DiscordLogin,
    ChangeChannel,
    // ConnectionAttempt
} from "./RateLimitSettings";

class RateLimits {
    constructor() {
        this.Note = new RateLimit(Note.Normal.period, Note.Normal.limit);
        this.Chat = new RateLimit(Chat.Normal.period, Chat.Normal.limit);
        // this.Data = new RateLimit(Data.period, Data.limit);
        this.Mouse = new RateLimit(Mouse.period, Mouse.limit);
        this.Chset = new RateLimit(Chset.period, Chset.limit);
        this.Chown = new RateLimit(Chown.period, Chown.limit);
        // this.NewId = new RateLimit(NewId.period, NewId.limit);
        // this.Custom = new RateLimit(Custom.period, Custom.limit);
        // this.Message = new RateLimit(Message.period, Message.limit);
        this.Userset = new RateLimit(Userset.period, Userset.limit);
        this.Kickban = new RateLimit(Kickban.period, Kickban.limit);
        this.RoomList = new RateLimit(RoomList.period, RoomList.limit);
        // this.Violations = new RateLimit(Violations.period, Violations.limit);
        // this.DiscordLogin = new RateLimit(DiscordLogin.period, DiscordLogin.limit);
        this.ChangeChannel = new RateLimit(ChangeChannel.period, ChangeChannel.limit);
        // this.ConnectionAttempt = new RateLimit(ConnectionAttempt.period, ConnectionAttempt.limit);
    }
}

export default RateLimits;