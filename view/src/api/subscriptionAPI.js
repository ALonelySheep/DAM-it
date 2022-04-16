const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllSubscriptions = async (userToken) => {
    // console.log("userToken");
    // console.log(userToken);
    const response = await fetch(`${API_ENDPOINT}/subscription`, {
        method: "GET",
        headers: {
            "authorization": userToken,
        },
    });
    const subscriptions = await response.json();
    // console.log(subscriptions)
    return subscriptions;
};

export const addSubscription = async (userToken, subscription) => {
    subscription.cycle = `${subscription.billingCycle} ${subscription.billingCycleUnit}`;
    delete subscription.submit;
    delete subscription.billingCycle;
    delete subscription.billingCycleUnit;
    console.log("POST subscription");
    console.log(subscription);
    // console.log("userToken");
    // console.log(userToken);
    const response = await fetch(`${API_ENDPOINT}/subscription`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    const newSubscription = await response.json();
    // console.log("newSubscription")
    // console.log(newSubscription)
    return newSubscription;
};

export const updateSubscription = async (userToken, subscription) => {
    subscription.cycle = `${subscription.billingCycle} ${subscription.billingCycleUnit}`;
    delete subscription.submit;
    delete subscription.billingCycle;
    delete subscription.billingCycleUnit;
    // subscription.startDate = subscription.startDate;
    // console.log("PUT subscription Data:");
    // console.log(subscription);
    subscription.startDate = new Date(subscription.startDate).toISOString();
    // console.log("PUT subscription Data: NEW");
    // console.log(subscription);
    // console.log("PUT subscription.startDate Data:");
    // console.log(new Date(subscription.startDate).toISOString().split('T')[0]);
    const response = await fetch(`${API_ENDPOINT}/subscription/${subscription.id}`, {
        method: "PUT",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    console.log("PUT subscription Response:");
    console.log(await response.json());
    return response.status;
};

export const deleteSubscription = async (userToken, id) => {
    // console.log('Delete fetch');
    const response = await fetch(`${API_ENDPOINT}/subscription/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": userToken,
        },
    });

    // console.log('Delete response', response.status);
    return response.status;
};