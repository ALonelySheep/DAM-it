const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getTotalValue = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/dashboard/total-value`, {
        headers: {
            "authorization": userToken,
        },
    });
    const value = await response.json();
    console.log(value)
    return value;
};

export const getMonthlyCost = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/dashboard/monthly-cost`, {
        headers: {
            "authorization": userToken,
        },
    });
    const value = await response.json();
    console.log(value)
    return value;
};
