import axios from 'axios';

export interface UserInfo {
    name: string;
    email: string;
    phone: string;
}

export interface UserCheckResult {
    hasExistingPayment: boolean;
    existingUserId: number | null;
    userInfo: UserInfo;
}

export const checkExistingUserFromStorage =
    async (): Promise<UserCheckResult> => {
        const savedEmail = localStorage.getItem('userEmail');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (!savedEmail) {
            return {
                hasExistingPayment: false,
                existingUserId: null,
                userInfo: {
                    name: '',
                    email: '',
                    phone: '',
                },
            };
        }

        try {
            const response = await axios.post(
                '/api/check-user-payment-method',
                {
                    email: savedEmail,
                }
            );

            if (response.data.success && response.data.has_payment_method) {
                return {
                    hasExistingPayment: true,
                    existingUserId: response.data.user_id,
                    userInfo: {
                        name: response.data.user_info.name,
                        email: response.data.user_info.email,
                        phone: response.data.user_info.phone,
                    },
                };
            } else {
                if (storedUserInfo) {
                    const parsedUserInfo = JSON.parse(storedUserInfo);
                    return {
                        hasExistingPayment: false,
                        existingUserId: null,
                        userInfo: {
                            name: parsedUserInfo.name || '',
                            email: savedEmail,
                            phone: parsedUserInfo.phone || '',
                        },
                    };
                } else {
                    return {
                        hasExistingPayment: false,
                        existingUserId: null,
                        userInfo: {
                            name: '',
                            email: savedEmail,
                            phone: '',
                        },
                    };
                }
            }
        } catch (error) {
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                return {
                    hasExistingPayment: false,
                    existingUserId: null,
                    userInfo: {
                        name: parsedUserInfo.name || '',
                        email: savedEmail,
                        phone: parsedUserInfo.phone || '',
                    },
                };
            } else {
                return {
                    hasExistingPayment: false,
                    existingUserId: null,
                    userInfo: {
                        name: '',
                        email: savedEmail,
                        phone: '',
                    },
                };
            }
        }
    };

export const checkExistingUser = async (
    email: string
): Promise<UserCheckResult> => {
    if (!email || !email.includes('@')) {
        return {
            hasExistingPayment: false,
            existingUserId: null,
            userInfo: {
                name: '',
                email: email,
                phone: '',
            },
        };
    }

    try {
        const response = await axios.post('/api/check-user-payment-method', {
            email: email,
        });

        if (response.data.success && response.data.has_payment_method) {
            return {
                hasExistingPayment: true,
                existingUserId: response.data.user_id,
                userInfo: {
                    name: response.data.user_info.name,
                    email: response.data.user_info.email,
                    phone: response.data.user_info.phone,
                },
            };
        } else {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                return {
                    hasExistingPayment: false,
                    existingUserId: null,
                    userInfo: {
                        name: parsedUserInfo.name || '',
                        email: email,
                        phone: parsedUserInfo.phone || '',
                    },
                };
            } else {
                return {
                    hasExistingPayment: false,
                    existingUserId: null,
                    userInfo: {
                        name: '',
                        email: email,
                        phone: '',
                    },
                };
            }
        }
    } catch (error) {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            return {
                hasExistingPayment: false,
                existingUserId: null,
                userInfo: {
                    name: parsedUserInfo.name || '',
                    email: email,
                    phone: parsedUserInfo.phone || '',
                },
            };
        } else {
            return {
                hasExistingPayment: false,
                existingUserId: null,
                userInfo: {
                    name: '',
                    email: email,
                    phone: '',
                },
            };
        }
    }
};
