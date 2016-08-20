function lowercase (value) {
    return value.toLowerCase();
}

export default function isKeyword ({type, value}, values) {
    if (type !== 'word') {
        return false;
    }
    if (Array.isArray(values)) {
        return ~values.map(lowercase).indexOf(lowercase(value));
    }
    return lowercase(value) === values;
}
