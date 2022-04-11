const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllApps = async () => {
    const response = await fetch(`${API_ENDPOINT}/app`);
    const apps = await response.json();
    return apps;
};

export const addApp = async (app) => {
    delete app.submit;
    delete app.isDelete;
    console.log("POST app");
    console.log(app);
    const response = await fetch(`${API_ENDPOINT}/app`, {
        method: "POST",
        body: JSON.stringify(app),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const newApp = await response.json();

    return newApp;
}

export const updateApp = async (app) => {
    delete app.submit;
    delete app.isDelete;
    console.log("PUT app Data:");
    console.log(app);
    const response = await fetch(`${API_ENDPOINT}/app/${app.id}`, {
        method: "PUT",
        body: JSON.stringify(app),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.status;
}

export const deleteApp = async (id) => {
    const response = await fetch(`${API_ENDPOINT}/app/${id}`, {
        method: "DELETE",
    });

    console.log('Delete response', response.status);
    return response.status;
};