export const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1`;

export const endpoints = {
  auth: {
    login: "/auth/email/login",
    register: "/auth/email/register",
    confirmEmail: "/auth/email/confirm",
    confirmNewEmail: "/auth/email/confirm/new",
    forgotPassword: "/auth/forgot/password",
    resetPassword: "/auth/reset/password",
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    facebookLogin: "/auth/facebook/login",
    googleLogin: "/auth/google/login",
    appleLogin: "/auth/apple/login",
  },
  professionals: {
    getProfessionals: "/professionals",
    addProfessionals: "/professionals",
    getIndividualProfessional: (id: number) => `/professionals/${id}`,
    updateProfessional: (id: number) => `/professionals/${id}`,
    deleteProfessional: (id: number) => `/professionals/${id}`,
  },
  candidates: {
    getCandidates: "/candidates",
    addCandidate: "/candidates",
    getIndividualCandidate: (id: number) => `/candidates/${id}`,
    updateCandidate: (id: number) => `/candidates/${id}`,
    deleteCandidate: (id: number) => `/candidates/${id}`,
  },
  governorates: {
    getGovernorates: "/governorates",
    addGovernorate: "/governorates",
    updateGovernorate: (id: number) => `/governorates/${id}`,
    deleteGovernorate: (id: number) => `/governorates/${id}`,
  },
  categories: {
    addCategory: "/categories",
    getMainCategories: "/categories/main",
    updateCategory: (id: number) => `/categories/${id}`,
    deleteCategory: (id: number) => `/categories/${id}`,
    getSubCategories: (parentId: number) =>
      `/categories/${parentId}/subcategories`,
    getSubSubCategories: (parentId: number) =>
      `/categories/${parentId}/subsubcategories`,
  },
};
