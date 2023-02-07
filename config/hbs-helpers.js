module.exports = {
    eq: function (a, b) {
        if (a === b) {
            return true;
        }
        return false;
    },
    lesse: function (a, b) {
        if (a <= b) {
            return true;
        }
        return false;
    },
    grte: function (a, b) {
        if (a >= b) {
            return true;
        }
        return false;
    },
    into: function (a, b) {
        if (a * b) {
            return a * b;
        }
    },
    logand: function (a, b) {
        if (a && b) {
            return a && b;
        }
    },
}