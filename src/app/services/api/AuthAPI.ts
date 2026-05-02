import { backendGateway } from "../backend/gateway";
import type {
  AuthUser,
  ChangePasswordData,
  RegisterData,
  UpdateProfileData,
} from "../backend/types";

const AuthAPI = {
  async registerProfile(data: Omit<RegisterData, "email" | "password">): Promise<AuthUser> {
    return backendGateway.auth.updateProfile({
      name: data.name,
      phone: data.phone,
    });
  },

  async getMe(): Promise<AuthUser> {
    const user = await backendGateway.auth.getCurrentProfile();
    if (!user) {
      throw new Error("Utilisateur non authentifie");
    }
    return user;
  },

  updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    return backendGateway.auth.updateProfile(data);
  },

  async deleteAccount(password?: string): Promise<void> {
    await backendGateway.auth.deleteAccount(password ?? "");
  },

  changePassword(data: ChangePasswordData): Promise<void> {
    return backendGateway.auth.changePassword(data);
  },
};

export type { AuthUser, RegisterData, UpdateProfileData, ChangePasswordData };
export default AuthAPI;
