import axios from 'axios';


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
export const fetchMajors = async () => {
  const response = await axios
    .get('https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api/major/all?pageNumber=1&pageSize=5')
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










