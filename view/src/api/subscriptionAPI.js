const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

export const getAllSubscriptions = async () => {
    const response = await fetch(`${API_ENDPOINT}/subscription`);
    const subscriptions = await response.json();
    // console.log(subscriptions)
    return subscriptions;
};

export const addSubscription = async (subscription) => {
    subscription.cycle = `${subscription.billingCycle} ${subscription.billingCycleUnit}`;
    delete subscription.submit;
    delete subscription.billingCycle;
    delete subscription.billingCycleUnit;
    console.log("POST subscription");
    console.log(subscription);
    const response = await fetch(`${API_ENDPOINT}/subscription`, {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const newSubscription = await response.json();

    return newSubscription;
};

export const updateSubscription = async (subscription) => {
    subscription.cycle = `${subscription.billingCycle} ${subscription.billingCycleUnit}`;
    delete subscription.submit;
    delete subscription.billingCycle;
    delete subscription.billingCycleUnit;
    console.log("PUT subscription Data:");
    console.log(subscription);
    const response = await fetch(`${API_ENDPOINT}/subscription/${subscription.id}`, {
        method: "PUT",
        body: JSON.stringify(subscription),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.status;
};

export const deleteSubscription = async (id) => {
    console.log('Delete fetch');
    const response = await fetch(`${API_ENDPOINT}/subscription/${id}`, {
        method: "DELETE",
    });

    console.log('Delete response', response.status);
    return response.status;
};