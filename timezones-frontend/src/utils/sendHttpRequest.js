import config from '../config.json';

const {
    api: {
      host: HOST,
      port: PORT
    }
} = config;

const sendHttpRequest = async ({
    data,
    urlParams,
    method = 'GET',
    endpoint = '/',
    returnText = false,
    authorize = true,
}, navigateCallback) => {
    const options = {
        method,
        headers: {
        },
    };

    if (
        ['POST', 'PATCH'].includes(method)
    ) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    if (authorize) {
        const token = localStorage.getItem('accessToken');

        options.headers.authorization = `Bearer ${token}`;
    }

    let urlParamsString = '';
    if (urlParams) {
        const searchParams = new URLSearchParams();
        Object.entries(urlParams)
            .map(([key, value]) => searchParams.set(key, value));

        const searchParamsString = searchParams.toString();
        if(searchParamsString) {
            urlParamsString = `?${searchParamsString}`;
        }
    }

    const response = await fetch(
        `http://${HOST}:${PORT}${endpoint}${urlParamsString}`,
        options
    );

    if (!response.ok) {
        const error = await response.json();

        if (error.name === 'TokenExpiredError') {
            localStorage.removeItem('accessToken');
            // TODO replace callback with error, which's handling will do this
            navigateCallback('/login');
        } else {
            throw error;
        }
    }

    const responseData = returnText 
        ? await response.text()
        : await response.json();

    return responseData;
};

export default sendHttpRequest;