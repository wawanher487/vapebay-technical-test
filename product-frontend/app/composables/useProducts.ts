// composables/useProducts.ts
import type {
  Product,
  CreateProductPayload,
  ApiResponse,
} from "~/types/product";

export function useProducts() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // FETCH ALL PRODUCTS
  async function fetchProducts() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ApiResponse<Product[]>>(
        `${baseURL}/api/products`,
      );
      products.value = response.data;
    } catch (err: any) {
      error.value =
        err.data?.message || "Gagal memuat produk. Coba lagi nanti.";
    } finally {
      isLoading.value = false;
    }
  }

  // CREATE PRODUCT
  async function createProduct(
    payload: CreateProductPayload,
  ): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ApiResponse<Product>>(
        `${baseURL}/api/products`,
        {
          method: "POST",
          body: payload,
        },
      );

      // Tambahkan produk baru ke awal array, UI langsung update tanpa re-fetch
      products.value.unshift(response.data);
      return true;
    } catch (err: any) {
      const msg = err.data?.message;
      // jika message adalah array (dari ValidationPipe), gabungkan jadi satu string
      error.value = Array.isArray(msg)
        ? msg.join(", ")
        : msg || "Gagal menambahkan produk.";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // SEARCH (client-side)
  // computed otomatis reactive, recalculate kalau products/searchQuery berubah
  const searchQuery = ref("");

  const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) return products.value;

    const query = searchQuery.value.toLowerCase();
    return products.value.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  });

  // PAGINATION (client-side)
  const currentPage = ref(1);
  const perPage = ref(6);

  // Reset ke halaman 1 setiap kali search query berubah
  watch(searchQuery, () => {
    currentPage.value = 1;
  });

  const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage.value),
  );

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredProducts.value.slice(start, end);
  });

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  return {
    // State
    products,
    isLoading,
    error,
    searchQuery,
    currentPage,
    totalPages,
    // Computed
    filteredProducts,
    paginatedProducts,
    // Methods
    fetchProducts,
    createProduct,
    goToPage,
  };
}
