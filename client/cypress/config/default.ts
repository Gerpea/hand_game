export default {
    e2e: {
        setupNodeEvents() { },
        baseUrl: 'http://localhost:8080',
        video: false,
        screenshotOnRunFailure: false,
        retries: {
            runMode: 3
        },
    },
} as const
