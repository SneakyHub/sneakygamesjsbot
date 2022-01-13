module.exports.info = {
    enabled: false
    /*
    DO NOT CHANGE, the functions file isnt't a normal file, it does not need to be triggerd on startup, doing so would crash the bot. 
    Thanks,
     - Creper92YT
    */
}

module.exports.checkPerms = (user, perm) => {
    if (!perm) return console.warn('Warn │ CheckPerms function triggerd without specifying a permission');
    if (!user) return console.warn('Warn │ CheckPerms function triggerd without specifying a user');
    if (!user.guild) return console.warn('Warn │ CheckPerms function expected a guildMember');
    return user.hasPermission(perm)
}

module.exports.formatNumber = async (number) => {
    if(isNaN(number)) return 'Input is not a number';

    number = Math.round(number)
    const list = [
        { number: 1, suffix: ''},
        { number: 1e3, suffix: 'k'},
        { number: 1e6, suffix: 'M'},
        { number: 1e9, suffix: 'B'},
        { number: 1e12, suffix: 'T'},
    ]

    var info;

    function format() {
        let entry = list.slice().reverse().find(function(e) { // Divide the list, then reverse it and find the fist list.number that is smaller/equal to number
            return number >= e.number; 
        });
        var s = entry ? (number / entry.number).toFixed(2).split('.')[0] : "0"; // If entry exists divide number by entry.number, then split the string with points, and just use the first part. This way we don't have to deal with decimal points.
        if(s >= 1000) {
            var current = list.findIndex(e => e.suffix === entry.suffix)
            current++
            entry = list[current]
            s = (number / entry.number).toFixed(2).split('.')[0]
        }
        number = s
        info = entry;
    }
    await format()
    return number + info.suffix

}