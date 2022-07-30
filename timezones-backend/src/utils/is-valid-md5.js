function isValidMD5(str)
{
    return !!str.match(/^[a-f0-9]{32}$/);
}

module.exports = isValidMD5;