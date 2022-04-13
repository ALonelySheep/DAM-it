import { useAuth } from 'AuthProvider'

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT
export const getAllPaidContents = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/paid-content`, {
        headers: {
            "authorization": userToken,
        },
    });
    const paidContents = await response.json();
    // console.log(paidContents)
    return paidContents;
};

export const addPaidContent = async (userToken, paidContent) => {
    delete paidContent.submit;
    console.log("POST paidContent");
    console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/paid-content`, {
        method: "POST",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const newPaidContent = await response.json();
    return newPaidContent;
};

export const updatePaidContent = async (userToken, paidContent) => {
    // paidContent.cycle = `${paidContent.billingCycle} ${paidContent.billingCycleUnit}`;
    delete paidContent.submit;
    // console.log("PUT paidContent Data:");
    // console.log(paidContent);
    const response = await fetch(`${API_ENDPOINT}/paid-content/${paidContent.id}`, {
        method: "PUT",
        body: JSON.stringify(paidContent),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });

    return response.status;
};

export const deletePaidContent = async (userToken, id) => {
    // console.log('Delete fetch');
    const response = await fetch(`${API_ENDPOINT}/paid-content/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": userToken,
        },
    });

    // console.log('Delete response', response.status);
    return response.status;
};