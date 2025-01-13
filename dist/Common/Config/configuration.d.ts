declare const _default: () => {
    env: string;
    port: string;
    frontendUrl: string;
    cloudinary_cloud_name: string;
    cloudinary_api_key: string;
    cloudinary_api_secret: string;
    jwt: {
        jwt_secret: string;
        expires_in: string;
        refresh_token_secret: string;
        refresh_token_expires_in: string;
        reset_pass_secret: string;
        reset_pass_token_expires_in: string;
    };
    reset_pass_link: string;
    emailSender: {
        email: string;
        app_pass: string;
    };
    ssl: {
        storeId: string;
        storePass: string;
        successUrl: string;
        cancelUrl: string;
        failUrl: string;
        sslPaymentApi: string;
        sslValidationApi: string;
    };
};
export default _default;
