export const config = {
    apiUrl: 'http://localhost:8443/',
    env: 'dev',
    socketUrl: 'ws://localhost:8443',
    socketIoOptions: {
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 2
    }
}