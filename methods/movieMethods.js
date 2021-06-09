const isUrl = (data) => {
    try {
        new URL(data);
        return true;
    }
    catch (err) {
        return false;
    }
};

const randomMovie = (firstIndex, lastIndex) => {
    return Math.round(Math.random() * (lastIndex - firstIndex) + firstIndex);
}

module.exports = {
    isUrl,
    randomMovie
}

