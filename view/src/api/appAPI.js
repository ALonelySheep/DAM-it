const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllApps = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/app`, {
        headers: {
            "authorization": userToken,
        },
    });
    const apps = await response.json();
    return apps;
};

export const addApp = async (userToken, app) => {
    delete app.submit;
    delete app.isDelete;
    // console.log("POST app");
    // console.log(app);
    const response = await fetch(`${API_ENDPOINT}/app`, {
        method: "POST",
        body: JSON.stringify(app),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const newApp = await response.json();

    return newApp;
}

export const updateApp = async (userToken, app) => {
    delete app.submit;
    delete app.isDelete;
    console.log("PUT app Data:");
    console.log(app);
    const response = await fetch(`${API_ENDPOINT}/app/${app.id}`, {
        method: "PUT",
        body: JSON.stringify(app),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const resData = await response.json()
    console.log("Update App Response:")
    console.log(resData[0])
    return resData[0];
}

export const deleteApp = async (userToken, id) => {
    const response = await fetch(`${API_ENDPOINT}/app/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": userToken,
        },
    });

    // console.log('Delete response', response.status);
    return response.status;
};