const Application = require('./src/application');


async function server() {
    const application = new Application();

    const shutdown = () => {  
        console.log('Shutting the server down');
        application.stop((error) => {
            console.log('Http server closed.');
    
            if (error) {
                console.error(error);
            }
    
            process.exit(error ? 1 : 0);
        });
    }

    process.on('SIGTERM', shutdown);
    // process.on('SIGINT', shutdown);

    await application.start();
}

server();

