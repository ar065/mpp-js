const IllegalChars = [
    "\n",
    "\r",
    "\v",
    "\0",
    "\t",
    "\u202e",
    "\u2066",
    "\u2067",
    "\u202b",
    "\u200f",
];

function ValidateString(string) {
    for (let i = 0; i < IllegalChars.length; i++) {
        const char = IllegalChars[i];
        string = string.replaceAll(char, "");
    }
    return string;
}

// export default ValidateString;
module.exports = ValidateString;
