
function setDefaultValues(object: any) {
    localStorage.setItem("default_checkout", JSON.stringify(object));
}

function getDefaultValues() {
    const defaultValues = localStorage.getItem("default_checkout");
    return defaultValues ? JSON.parse(defaultValues) : {};
}

export { getDefaultValues, setDefaultValues };

