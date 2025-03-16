import axios from 'axios';




 
 

 

const API_BASE_URL =
  "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/major?pageNumber=1&pageSize=5";

const getToken = (): string | null => {
  const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  console.log("🔑 Token lấy từ localStorage:", token);
  return token;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (!token) {
      console.error("⚠ Không tìm thấy token, có thể user chưa đăng nhập!");
      throw new Error("Unauthorized - Token không tồn tại");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error("❌ Lỗi interceptor request:", error);
    return Promise.reject(error);
  }
);

export const fetchMajors = async () => {
  try {
    console.log("🚀 Gọi API Major...");
    const response = await axiosInstance.get("");

    console.log("✅ API Response:", response.data);

    if (!response.data || !response.data.message || !response.data.message.items || !Array.isArray(response.data.message.items.$values)) {
      throw new Error("❌ API không trả về danh sách majors hợp lệ!");
    }

    return response.data.message.items.$values; // Trả về danh sách majors
  } catch (error: any) {
    console.error("❌ Lỗi khi tải Major:", error?.response?.status, error?.response?.data);

    if (error.response?.status === 401) {
      console.warn("⚠ Token có thể đã hết hạn, cần đăng nhập lại!");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return [];
  }
};












// Add this at the top of the file, after the import statements
interface UniversityApi {
  Name: string;
  Location: string;
  UniversityCode: string;
  Email: string;
  PhoneNumber: string;
  EstablishedDate: string;
  Accreditation: string;
  Type: string;
  Description: string;
  RankingNational: number;
  RankingInternational: number;
  Image: File | null;
}

interface University {
  id: string;
  name: string;
  location: string;
  universityCode: string;
  email: string;
  phoneNumber: string;
  establishedDate: string;
  accreditation: string;
  type: string;
  description: string;
  rankingNational: number;
  rankingInternational: number;
  image: string;
}

// Add these interfaces near the top of the file after other interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  verified: boolean;
  img?: string;
}

// GET TOP DEALS
export const fetchTopDeals = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/topdeals')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL USERS
export const fetchTotalUsers = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalusers')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PRODUCTS
export const fetchTotalProducts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalproducts')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL RATIO
export const fetchTotalRatio = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalratio')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE
export const fetchTotalRevenue = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalrevenue')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL SOURCE
export const fetchTotalSource = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalsource')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL VISIT
export const fetchTotalVisit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalvisit')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL REVENUE BY PRODUCTS
export const fetchTotalRevenueByProducts = async () => {
  const response = await axios
    .get(
      'https://react-admin-ui-v1-api.vercel.app/totalrevenue-by-product'
    )
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET TOTAL PROFIT
export const fetchTotalProfit = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/totalprofit')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL USERS
export const fetchUsers = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/users')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE USER
export const fetchSingleUser = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/users/${id}`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL PRODUCTS
export const fetchProducts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/products')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET SINGLE PRODUCT
export const fetchSingleProduct = async (id: string) => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/products/${id}`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL ORDERS
export const fetchOrders = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/orders')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL POSTS
export const fetchPosts = async () => {
  const response = await axios
    .get('https://react-admin-ui-v1-api.vercel.app/posts')
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL NOTES
export const fetchNotes = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/notes?q=`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

// GET ALL LOGS
export const fetchLogs = async () => {
  const response = await axios
    .get(`https://react-admin-ui-v1-api.vercel.app/logs`)
    .then((res) => {
      console.log('axios get:', res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

//get university
export const fetchUniversity = async () => {
  try {
    console.log("Bắt đầu gọi API university");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university?pageNumber=1&pageSize=5", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 API Response:", JSON.stringify(data, null, 2));

    let universities = [];
    if (data && data.message && data.message.items && data.message.items.$values) {
      universities = data.message.items.$values;
    } else if (data && data.items && data.items.$values) {
      universities = data.items.$values;
    } else if (data && data.items && Array.isArray(data.items)) {
      universities = data.items;
    } else if (Array.isArray(data)) {
      universities = data;
    } else {
      throw new Error("Cấu trúc dữ liệu từ API không hợp lệ");
    }

    if (!Array.isArray(universities) || universities.length === 0) {
      throw new Error("Không có dữ liệu trường đại học nào từ API");
    }

    const normalizedUniversities = universities.map((uni) => ({
      id: uni.id || uni.universityId || "unknown",
      name: uni.name || "Không có tên",
      location: uni.location || "Không xác định",
      universityCode: uni.universityCode || uni.code || "N/A",
      email: uni.email || "N/A",
      phoneNumber: uni.phoneNumber || "N/A",
      establishedDate: uni.establishedDate || "N/A",
      accreditation: uni.accreditation || "N/A",
      type: uni.type || "N/A",
      description: uni.description || null,
      rankingNational: uni.rankingNational || 0,
      rankingInternational: uni.rankingInternational || 0,
      image: uni.image || null,
    }));

    return { items: normalizedUniversities };
  } catch (error) {
    console.error("Lỗi khi tải danh sách trường:", error);
    throw error;
  }
};

export const addUniversity = async (university: UniversityApi) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams({
      Name: university.Name,
      Location: university.Location,
      UniversityCode: university.UniversityCode,
      Email: university.Email,
      PhoneNumber: university.PhoneNumber,
      EstablishedDate: university.EstablishedDate,
      Accreditation: university.Accreditation,
      Type: university.Type,
      Description: university.Description,
      RankingNational: university.RankingNational.toString(),
      RankingInternational: university.RankingInternational.toString(),
    }).toString();

    const formData = new FormData();
    if (university.Image) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (university.Image.size > maxSize) {
        throw new Error("File ảnh vượt quá kích thước cho phép (5MB)");
      }
      formData.append("Image", university.Image);
    }

    console.log("Query parameters:", queryParams);
    console.log("FormData (Image):", university.Image ? university.Image.name : "No file selected");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn("Yêu cầu bị hủy do timeout sau 30 giây");
    }, 30000);

    const url = `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university?${queryParams}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.statusText);
      const errorMessage = errorData.message || JSON.stringify(errorData) || response.statusText;
      throw new Error(`Không thể thêm trường đại học: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Dữ liệu trả về từ API:", JSON.stringify(data, null, 2));

    // Chuẩn hóa dữ liệu từ university gửi đi, chỉ lấy id từ response nếu có
    const normalizedUniversity: University = {
      id: data.id || "unknown", // Lấy id từ response nếu có, nếu không dùng "unknown"
      name: university.Name,
      location: university.Location,
      universityCode: university.UniversityCode,
      email: university.Email,
      phoneNumber: university.PhoneNumber,
      establishedDate: university.EstablishedDate || "N/A",
      accreditation: university.Accreditation || "N/A",
      type: university.Type,
      description: university.Description,
      rankingNational: university.RankingNational,
      rankingInternational: university.RankingInternational,
      image: data.image || (university.Image ? university.Image.name : null), // Dùng image từ response nếu có, nếu không dùng tên file
    };

    return normalizedUniversity;
  } catch (error) {
    console.error("Lỗi khi thêm trường đại học:", error);
    throw error;
  }
};

export const deleteUniversity = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn("Yêu cầu bị hủy do timeout sau 10 giây");
    }, 10000);

    const url = `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.statusText);
      const errorMessage = errorData.message || JSON.stringify(errorData) || response.statusText;
      throw new Error(`Không thể xóa trường đại học: ${errorMessage}`);
    }

    console.log(`Đã xóa trường đại học với id: ${id}`);
    return true; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error("Lỗi khi xóa trường đại học:", error);
    throw error;
  }
};

export const updateUniversity = async (id: string, university: UniversityApi) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không có token, vui lòng đăng nhập");
    }

    const queryParams = new URLSearchParams({
      Name: university.Name,
      Location: university.Location,
      UniversityCode: university.UniversityCode,
      Email: university.Email,
      PhoneNumber: university.PhoneNumber,
      EstablishedDate: university.EstablishedDate,
      Accreditation: university.Accreditation,
      Type: university.Type,
      Description: university.Description,
      RankingNational: university.RankingNational.toString(),
      RankingInternational: university.RankingInternational.toString(),
    }).toString();

    const formData = new FormData();
    if (university.Image) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (university.Image.size > maxSize) {
        throw new Error("File ảnh vượt quá kích thước cho phép (5MB)");
      }
      formData.append("Image", university.Image);
    }

    console.log("Query parameters (update):", queryParams);
    console.log("FormData (Image):", university.Image ? university.Image.name : "No file selected");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn("Yêu cầu bị hủy do timeout sau 30 giây");
    }, 30000);

    const url = `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/university/${id}?${queryParams}`;
    const response = await fetch(url, {
      method: "PATCH", // Đổi từ PUT sang PATCH
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.statusText);
      const errorMessage = errorData.message || JSON.stringify(errorData) || response.statusText;
      throw new Error(`Không thể cập nhật trường đại học: ${errorMessage}`);
    }

    const data = await response.json();
    console.log("Dữ liệu trả về từ API (update):", JSON.stringify(data, null, 2));

    const normalizedUniversity: University = {
      id: id,
      name: university.Name,
      location: university.Location,
      universityCode: university.UniversityCode,
      email: university.Email,
      phoneNumber: university.PhoneNumber,
      establishedDate: university.EstablishedDate || "N/A",
      accreditation: university.Accreditation || "N/A",
      type: university.Type,
      description: university.Description,
      rankingNational: university.RankingNational,
      rankingInternational: university.RankingInternational,
      image: data.image || university.Image?.name || null,
    };

    return normalizedUniversity;
  } catch (error) {
    console.error("Lỗi khi cập nhật trường đại học:", error);
    throw error;
  }
};

// Add this new function after other fetch functions
export const getUserList = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/user?pageNumber=1&pageSize=5", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 User API Response:", JSON.stringify(data, null, 2));

    // Extract users array from response based on your API structure
    let users = [];
    if (data && data.message && data.message.items && data.message.items.$values) {
      users = data.message.items.$values;
    } else if (data && data.items && data.items.$values) {
      users = data.items.$values;
    } else if (data && data.items && Array.isArray(data.items)) {
      users = data.items;
    } else if (Array.isArray(data)) {
      users = data;
    } else {
      throw new Error("Invalid data structure from API");
    }

    // Normalize the user data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedUsers: User[] = users.map((user: any) => ({
      id: user.id || user.userId || "unknown",
      firstName: user.firstName || user.name || "No name",
      lastName: user.lastName || "",
      email: user.email || "N/A",
      phone: user.phone || user.phoneNumber || "N/A",
      createdAt: user.createdAt || new Date().toISOString(),
      verified: user.verified || false,
      img: user.img || user.image || null,
    }));

    return normalizedUsers;

  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

interface Admission {
  id: string;
  universityName: string;
  majorName: string;
  methodName: string;
  admissionDate: string;
}

export const getAdmissionList = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/admissioninfor?pageNumber=1&pageSize=5",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 Admission API Response:", JSON.stringify(data, null, 2));

    // Extract admissions array from response
    let admissions = [];
    if (data && data.message && data.message.items && data.message.items.$values) {
      admissions = data.message.items.$values;
    } else {
      throw new Error("Invalid data structure from API");
    }

    // Normalize the admission data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedAdmissions: Admission[] = admissions.map((admission: any) => ({
      id: admission.id || "unknown",
      universityName: admission.universityName || "N/A",
      majorName: admission.majorName || "N/A",
      methodName: admission.methodName || "N/A",
      admissionDate: admission.admisstionDate || admission.admissionDate || "N/A", // Handle potential typo in API ("admisstionDate")
    }));

    return normalizedAdmissions;

  } catch (error) {
    console.error("Error fetching admissions:", error);
    throw error;
  }
};

// Đặt trong file types hoặc cùng file với hàm API
export interface AdmissionMethod {
  id: string;
  methodName: string;
  requiredDocuments: string | null;
  description: string | null;
}

export interface AdmissionInput {
  methodName: string;
  requiredDocuments?: string | null;
  description?: string | null;
}

export const getAdmissionMethod = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/admissionmethod?pageNumber=1&pageSize=5",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 Admission API Response:", JSON.stringify(data, null, 2));

    // Extract admissions array from response
    let admissions = [];
    if (data && data.message && data.message.items && data.message.items.$values) {
      admissions = data.message.items.$values;
    } else {
      throw new Error("Invalid data structure from API");
    }

    // Normalize the admission data with explicit type
    const normalizedAdmissions: AdmissionMethod[] = admissions.map((admission: AdmissionMethod) => ({
      id: admission.id || "unknown",
      methodName: admission.methodName || "N/A",
      requiredDocuments: admission.requiredDocuments || "None",
      description: admission.description || "No description",
    }));

    return normalizedAdmissions;
  } catch (error) {
    console.error("Error fetching admissions:", error);
    throw error;
  }
};

export const createAdmissionMethod = async (admissionData: AdmissionInput) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/admissionmethod", // Đồng bộ endpoint
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admissionData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 Create Admission Method Response:", JSON.stringify(data, null, 2));

    // Normalize the response data
    const newAdmission: AdmissionMethod = {
      id: data.id || "unknown",
      methodName: data.methodName || admissionData.methodName,
      requiredDocuments: data.requiredDocuments || admissionData.requiredDocuments || "None",
      description: data.description || admissionData.description || "No description",
    };

    return newAdmission;
  } catch (error) {
    console.error("Error creating admission method:", error);
    throw error;
  }
};
export const deleteAdmissionMethod = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/admissionmethod/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    // API DELETE thường không trả về body, nên chỉ cần trả về id đã xóa
    return id;
  } catch (error) {
    console.error("Error deleting admission method:", error);
    throw error;
  }
};
export const updateAdmissionMethod = async (id: string, admissionData: AdmissionInput) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/admissionmethod/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(admissionData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 Update Admission Method Response:", JSON.stringify(data, null, 2));

    const updatedAdmission: AdmissionMethod = {
      id: data.id || id,
      methodName: data.methodName || admissionData.methodName,
      requiredDocuments: data.requiredDocuments || admissionData.requiredDocuments || null,
      description: data.description || admissionData.description || null,
    };

    return updatedAdmission;
  } catch (error) {
    console.error("Error updating admission method:", error);
    throw error;
  }
};

// api/ApiCollection.ts

// api/ApiCollection.ts

export interface AcademicYear {
  id: string;
  year: number;
}

export interface AcademicYearInput {
  year: number;
}

export interface PaginatedResponse<T> {
  message: {
    items: {
      $values: T[];
    };
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Lấy danh sách AcademicYear
export const getAcademicYears = async (): Promise<AcademicYear[]> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/academicyear",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data: PaginatedResponse<AcademicYear> = await response.json();
    return data.message.items.$values; // Trả về mảng AcademicYear
  } catch (error) {
    console.error("Error fetching academic years:", error);
    throw error;
  }
};

// Tạo mới AcademicYear
export const createAcademicYear = async (academicYearData: AcademicYearInput) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/academicyear",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(academicYearData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    return await response.json() as AcademicYear;
  } catch (error) {
    console.error("Error creating academic year:", error);
    throw error;
  }
};

// Cập nhật AcademicYear
export const updateAcademicYear = async (id: string, academicYearData: AcademicYearInput) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/academicyear/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(academicYearData),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    return await response.json() as AcademicYear;
  } catch (error) {
    console.error("Error updating academic year:", error);
    throw error;
  }
};

// Xóa AcademicYear
export const deleteAcademicYear = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found, please login");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/academicyear/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    return id;
  } catch (error) {
    console.error("Error deleting academic year:", error);
    throw error;
  }
};













