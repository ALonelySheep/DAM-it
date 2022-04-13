const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllPersonalWorks = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/personal-work`, {
        headers: {
            "authorization": userToken,
        },
    });
    const personalWork = await response.json();
    // console.log(personalWork)
    return personalWork;
};

export const addPersonalWork = async (userToken, paidContent) => {
    delete paidContent.submit;
    console.log("POST paidContent");
    console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/personal-work`, {
        method: "POST",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const newPersonalWork = await response.json();
    return newPersonalWork;
};

export const updatePersonalWork = async (userToken, paidContent) => {
    delete paidContent.submit;
    // console.log("PUT paidContent Data:");
    // console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/personal-work/${paidContent.id}`, {
        method: "PUT",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });

    return response.status;
};

export const deletePersonalWork = async (userToken, id) => {
    // console.log('Delete fetch');
    const response = await fetch(`${API_ENDPOINT}/personal-work/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": userToken,
        },
    });

    // console.log('Delete response', response.status);
    return response.status;
};