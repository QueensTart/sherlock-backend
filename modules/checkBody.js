function checkBody(body, element) {
    let valid = true;

    for(const field of element)
    {
        if(!body[field] || body[field] === "")
        {
            valid = false;
        }
    }
    return valid;
}

module.exports = { checkBody };