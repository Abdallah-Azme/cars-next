export type User = {
  id: number,
  name: string,
  email: string,
  role: string,
  statue: string|null,
  avatar: string|null,
  createdAt: string,
  updatedAt: string
}

export type AuthState = {
  token: string | null | undefined;
  user: User|null;
  isAuthenticated: boolean;
  setAuth: (data: { token: string; user?: User }) => void;
  logout: () => void;
};

export type RegisterResponse = {
    success: boolean|string,
    message: string,
    data: {
        user: {
            id: number,
            name: string,
            email: string,
            role: string,
            statue: string|null,
            avatar: string|null,
            createdAt: string,
            updatedAt: string
        },
        verificationCode?: string
    }
}


export type LoginResponse = {
    success: boolean|string,
    message: string,
    data: {
        user: User,
        accessToken: string,
        refreshToken: string,
        tokenType: string,
        accessExpiresIn: number,
        refreshExpiresIn: number
    }
}

export type UpdateProfileResponse = {
    success: boolean | string;
    message: string;
    data: {
        user: User;
    };
};

export type ChangePasswordResponse = {
    success: boolean | string;
    message: string;
    data: null
};
