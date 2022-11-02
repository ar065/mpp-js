// import WebSocket from "ws";
// import { EventEmitter } from "events";
// import ValidateString from "./src/ValidateString.js";
// // prettier-ignore
// import { HttpResponseCodes, WebSocketResponseCodes } from "./src/ResponseCodes.js";
const WebSocket = require("ws");
const { EventEmitter } = require("events");
const ValidateString = require("./src/ValidateString.js");
// prettier-ignore
const { HttpResponseCodes, WebSocketResponseCodes } = require("./src/ResponseCodes.js")

class Client extends EventEmitter {
    /**
     * @param {Object} options Options for client.
     * @param {string} [options.uri] Websocket server address.
     * @param {boolean} [options.unsafe] Whether to run without token.
     * @param {string} options.token Your bot token.
     */
    constructor(options) {
        super();

        this.uri = options.uri || "wss://mppclone.com:8443/";
        this.unsafe = options.unsafe || false;
        this.token = options.token;

        this.httpResponseCodes = HttpResponseCodes;
        this.webSocketResponseCodes = WebSocketResponseCodes;

        this.ws = null;
        this.user = null;
        this.channel = null;
        this.pingInterval = null;
        this.participantId = null;
        this.connectionTime = null;
        this.desiredChannelId = null;
        this.noteFlushInterval = null;
        this.desiredChannelSettings = null;

        this["🐈"] = 0;
        this.noteBufferTime = 0;
        this.serverTimeOffset = 0;
        this.connectionAttempts = 0;

        this.ppl = {};
        this.permissions = {};

        this.canConnect = false;

        this.noteBuffer = [];

        this.bindEventListeners();

        this.offlineSettings = {
            channel: {
                color: "#ecfaed",
            },
            participant: {
                _id: "",
                name: "",
                color: "#777",
            },
        };
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    isConnecting() {
        return this.ws && this.ws.readyState === WebSocket.CONNECTING;
    }

    start() {
        this.canConnect = true;
        if (!this.connectionTime) {
            this.connect();
        }
    }

    stop() {
        this.canConnect = false;
        if (this.ws) this.ws.close();
    }

    connect() {
        if (!this.canConnect || this.isConnected() || this.isConnecting())
            return;
        const self = this;

        this.ws = new WebSocket(this.uri, {
            origin: "https://www.multiplayerpiano.com",
        });

        this.ws.addEventListener("close", function (evt) {
            self.user = null;
            self.channel = null;
            self.participantId = null;

            self.setParticipants([]);
            clearInterval(self.pingInterval);
            clearInterval(self.noteFlushInterval);

            self.emit("disconnect", evt);

            // reconnect!
            if (self.connectionTime) {
                self.connectionTime = null;
                self.connectionAttempts = 0;
            } else {
                ++self.connectionAttempts;
            }

            const ms_lut = [50, 2500, 10000];
            let idx = self.connectionAttempts;

            if (idx >= ms_lut.length) idx = ms_lut.length - 1;
            const ms = ms_lut[idx];

            setTimeout(self.connect.bind(self), ms);
        });
        this.ws.addEventListener("error", function (err) {
            self.emit("wserror", err);
            if (self.ws) self.ws.close(); // self.ws.emit("close");
        });
        this.ws.addEventListener("open", function (evt) {
            self.pingInterval = setInterval(function () {
                self.sendPing();
            }, 20000);

            self.noteBuffer = [];
            self.noteBufferTime = 0;

            self.noteFlushInterval = setInterval(function () {
                if (self.noteBufferTime && self.noteBuffer.length > 0) {
                    self.sendArray([
                        {
                            m: "n",
                            t: self.noteBufferTime + self.serverTimeOffset,
                            n: self.noteBuffer,
                        },
                    ]);
                    self.noteBufferTime = 0;
                    self.noteBuffer = [];
                }
            }, 200);

            self.emit("connect");
        });
        this.ws.addEventListener("message", async function (evt) {
            const transmission = JSON.parse(evt.data.toString());
            for (let i = 0; i < transmission.length; i++) {
                const msg = transmission[i];
                self.emit(msg.m, msg);
            }
        });
    }

    bindEventListeners() {
        const self = this;
        this.on("hi", function (msg) {
            self.user = msg.u;
            self.connectionTime = Date.now();
            self.receiveServerTime(msg.t);

            if (self.desiredChannelId) self.setChannel();

            if (msg.permissions) {
                self.permissions = msg.permissions;
            } else {
                self.permissions = {};
            }
        });
        this.on("t", function (msg) {
            self.receiveServerTime(msg.t);
        });
        this.on("ch", function (msg) {
            self.desiredChannelId = msg.ch._id;
            self.desiredChannelSettings = msg.ch.settings;
            self.channel = msg.ch;
            if (msg.p) self.participantId = msg.p;
            self.setParticipants(msg.ppl);
        });
        this.on("p", function (msg) {
            self.participantUpdate(msg);
            self.emit("participant update", self.findParticipantById(msg.id));
        });
        this.on("m", function (msg) {
            if (self.ppl.hasOwnProperty(msg.id)) {
                self.participantMoveMouse(msg);
            }
        });
        this.on("bye", function (msg) {
            self.removeParticipant(msg.p);
        });
        this.on("b", function (msg) {
            if (!self.token && !self.unsafe) {
                throw "Token not provided with options. Set unsafe to true to ignore this message.";
            }
            self.sendArray([
                {
                    m: "hi",
                    token: self.token,
                },
            ]);
        });
    }

    send(raw) {
        if (this.isConnected() && this.ws) this.ws.send(raw);
    }

    sendArray(arr) {
        this.send(JSON.stringify(arr));
    }

    setChannel(id, set) {
        this.desiredChannelId = id || this.desiredChannelId || "lobby";
        this.desiredChannelSettings =
            set || this.desiredChannelSettings || null;
        this.sendArray([
            {
                m: "ch",
                _id: this.desiredChannelId,
                set: this.desiredChannelSettings,
            },
        ]);
        return true;
    }

    getChannelSetting(key) {
        if (!this.isConnected() || !this.channel || !this.channel.settings) {
            return this.offlineSettings.channel[key];
        }
        return this.channel.settings[key];
    }

    setChannelSettings(settings) {
        if (!this.isConnected() || !this.channel || !this.channel.settings) {
            return;
        }
        if (this.desiredChannelSettings) {
            for (let key in settings) {
                this.desiredChannelSettings[key] = settings[key];
            }
            this.chset(this.desiredChannelSettings);
        }
    }

    getOwnParticipant() {
        return this.findParticipantById(this.participantId);
    }

    setParticipants(ppl) {
        // remove participants who left
        for (const id in this.ppl) {
            if (!this.ppl.hasOwnProperty(id)) continue;
            let found = false;
            for (let j = 0; j < ppl.length; j++) {
                if (ppl[j].id === id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.removeParticipant(id);
            }
        }
        // update all
        for (let i = 0; i < ppl.length; i++) {
            this.participantUpdate(ppl[i]);
        }
    }

    countParticipants() {
        let count = 0;
        for (const i in this.ppl) {
            if (this.ppl.hasOwnProperty(i)) ++count;
        }
        return count;
    }

    participantUpdate(update) {
        let part = this.ppl[update.id] || null;
        if (part === null) {
            part = update;
            this.ppl[part.id] = part;
            this.emit("participant added", part);
            this.emit("count", this.countParticipants());
        } else {
            Object.keys(update).forEach((key) => {
                part[key] = update[key];
            });
            if (!update.tag) delete part.tag;
            if (!update.vanished) delete part.vanished;
        }
    }

    participantMoveMouse(update) {
        const part = this.ppl[update.id] || null;
        if (part !== null) {
            part.x = update.x;
            part.y = update.y;
        }
    }

    removeParticipant(id) {
        if (this.ppl.hasOwnProperty(id)) {
            const part = this.ppl[id];
            delete this.ppl[id];
            this.emit("participant removed", part);
            this.emit("count", this.countParticipants());
        }
    }

    findParticipantById(id) {
        return this.ppl[id] || this.offlineSettings.participant;
    }

    isOwner() {
        return (
            this.channel &&
            this.channel.crown &&
            this.channel.crown.participantId === this.participantId
        );
    }

    preventsPlaying() {
        return (
            this.isConnected() &&
            !this.isOwner() &&
            this.getChannelSetting("crownsolo") === true &&
            !this.permissions.playNotesAnywhere
        );
    }

    receiveServerTime(time) {
        const self = this;
        const now = Date.now();
        const target = time - now;
        const duration = 1000;
        let step = 0;
        const steps = 50;
        const step_ms = duration / steps;
        const difference = target - this.serverTimeOffset;
        const inc = difference / steps;
        let iv;
        iv = setInterval(function () {
            self.serverTimeOffset += inc;
            if (++step >= steps) {
                clearInterval(iv);
                self.serverTimeOffset = target;
            }
        }, step_ms);
    }

    startNote(note, vel) {
        if (typeof note !== "string") return false;
        if (this.isConnected()) {
            vel = typeof vel === "undefined" ? undefined : +vel.toFixed(3);
            if (!this.noteBufferTime) {
                this.noteBufferTime = Date.now();
                this.noteBuffer.push({
                    n: note,
                    v: vel,
                });
            } else {
                this.noteBuffer.push({
                    d: Date.now() - this.noteBufferTime,
                    n: note,
                    v: vel,
                });
            }
            return true;
        }
        return false;
    }

    stopNote(note) {
        if (typeof note !== "string") return false;
        if (this.isConnected()) {
            if (!this.noteBufferTime) {
                this.noteBufferTime = Date.now();
                this.noteBuffer.push({
                    n: note,
                    s: 1,
                });
            } else {
                this.noteBuffer.push({
                    d: Date.now() - this.noteBufferTime,
                    n: note,
                    s: 1,
                });
            }
            return true;
        }
        return false;
    }

    sendPing() {
        this.sendArray([
            {
                m: "t",
                e: Date.now(),
            },
        ]);
    }

    sendChat(message) {
        this.sendArray([{ m: "a", message: ValidateString(message) }]);
        return true;
    }

    userset(set) {
        this.sendArray([{ m: "userset", set }]);
        return true;
    }

    moveMouse(x, y) {
        this.sendArray([{ m: "m", x, y }]);
        return true;
    }

    kickBan(_id, ms) {
        this.sendArray([{ m: "kickban", _id, ms }]);
        return true;
    }

    chown(id) {
        this.sendArray([{ m: "chown", id }]);
        return true;
    }

    chset(set) {
        this.sendArray([{ m: "chset", set }]);
        return true;
    }

    setName(name) {
        return this.userset({ name });
    }

    setColor(color) {
        return this.userset({ color });
    }
}

// export default Client;
module.exports = Client;
