const API_BASE_URL = 'http://localhost:3000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Documents API
export const documentsApi = {
  getAll: () => fetchApi('/documents'),
  create: (document: any) => fetchApi('/documents', {
    method: 'POST',
    body: JSON.stringify(document),
  }),
};

// Users API
export const usersApi = {
  getAll: () => fetchApi('/users'),
};

// Classes API
export const classesApi = {
  getAll: () => fetchApi('/classes'),
};

// Achievements API
export const achievementsApi = {
  getAll: () => fetchApi('/achievements'),
}; 