const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllDevices = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/device`, {
        headers: {
            "authorization": userToken,
        },
    });
    const device = await response.json();
    // console.log(device)
    return device;
};

export const addDevice = async (userToken, paidContent) => {
    delete paidContent.submit;
    console.log("POST paidContent");
    console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/device`, {
        method: "POST",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const newDevice = await response.json();
    return newDevice;
};

export const updateDevice = async (userToken, paidContent) => {
    delete paidContent.submit;
    // console.log("PUT paidContent Data:");
    // console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/device/${paidContent.id}`, {
        method: "PUT",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });

    return response.status;
};

export const deleteDevice = async (userToken, id) => {
    // console.log('Delete fetch');
    const response = await fetch(`${API_ENDPOINT}/device/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": userToken,
        },
    });

    // console.log('Delete response', response.status); 
    return response.status;
};