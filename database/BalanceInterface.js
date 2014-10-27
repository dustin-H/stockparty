var Guest = require('./models/Balance');

var m = module.exports = {};

m.addBalance = function (idk, time, balance, cb) {
    var balance = new Balance({
                idk: idk,
                time: time,
                balance: balance
            });
            balance.save(function (err, balance) {
                if (err) return console.error(err);
                console.log('saved');
                cb(true);
            });
       
};    

m.getAllEntriesForGuest = function (guest, error, cb) {
    Consumption.find({guest: guest}, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var ex = {};
            for (var i in guests) {
                ex[guests[i].time] = guests[i];
            }
            var temp = JSON.parse(JSON.stringify(ex));
            cb(temp);
        }
    });
};

m.getTotalForGuest = function (guest, error, cb) {
    Consumption.find({guest: guest}, function (err, guests) {
        if (err) {
            error(err);
        } else {
            var total = 0;
            for (var i in guests) {
                total += guests[i].balance;
            }
            cb(total);
        }
    });
};