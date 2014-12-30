function dateToIsoString(date) {

    function padStr(i) {
        return (i < 10) ? "0" + i : "" + i;
    }

    return date.getFullYear() + "-" + padStr(date.getMonth() + 1) + "-" + padStr(date.getDate());
}
