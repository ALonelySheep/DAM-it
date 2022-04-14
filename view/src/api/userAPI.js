const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

const addUser = async (userToken) => {
    const response = await fetch(`${API_ENDPOINT}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": userToken,
        },
    });
    return response.status;
};


export default addUser;



