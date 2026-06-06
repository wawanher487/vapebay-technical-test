<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-3">
        <div class="p-2 bg-blue-600 rounded-lg">
          <ShoppingBag class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Daftar Produk</h1>
          <p class="text-sm text-gray-500">
            Kelola dan lihat semua produk tersedia
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar: Form -->
        <div class="lg:col-span-1">
          <ProductForm
            ref="productFormRef"
            :is-loading="isLoading"
            :error="error"
            @submit="handleCreateProduct"
          />
        </div>

        <!-- Main: Search + Product List -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Search Bar -->
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk berdasarkan nama atau deskripsi..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <!-- Tombol clear search -->
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Stats bar -->
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>
              Menampilkan
              <strong class="text-gray-700">{{
                filteredProducts.length
              }}</strong>
              produk
              <template v-if="searchQuery">
                untuk "<strong class="text-gray-700">{{ searchQuery }}</strong
                >"
              </template>
            </span>
          </div>

          <!-- Loading skeleton -->
          <div
            v-if="isLoading && products.length === 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div
              v-for="n in 4"
              :key="n"
              class="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
            >
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="!isLoading && filteredProducts.length === 0"
            class="text-center py-16 bg-white rounded-xl border border-gray-100"
          >
            <div class="flex justify-center mb-3">
              <PackageSearch class="w-12 h-12 text-gray-300" />
            </div>
            <p class="font-medium text-gray-500">
              {{ searchQuery ? "Produk tidak ditemukan" : "Belum ada produk" }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{
                searchQuery
                  ? "Coba kata kunci lain"
                  : "Tambahkan produk pertama lewat form di samping"
              }}
            </p>
          </div>

          <!-- Product grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex items-center justify-between pt-2"
          >
            <p class="text-sm text-gray-500">
              Halaman {{ currentPage }} dari {{ totalPages }}
            </p>
            <div class="flex items-center gap-1">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                class="w-9 h-9 text-sm border rounded-lg transition-colors font-medium"
                :class="
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                "
              >
                {{ page }}
              </button>

              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingBag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
} from "lucide-vue-next";
import type { CreateProductPayload } from "~/types/product";

useHead({
  title: "Daftar Produk",
  meta: [{ name: "description", content: "Manajemen produk aplikasi" }],
});

const {
  products,
  isLoading,
  error,
  searchQuery,
  currentPage,
  totalPages,
  filteredProducts,
  paginatedProducts,
  fetchProducts,
  createProduct,
  goToPage,
} = useProducts();

const productFormRef = ref();

onMounted(() => {
  fetchProducts();
});

async function handleCreateProduct(payload: CreateProductPayload) {
  const success = await createProduct(payload);
  if (success) {
    productFormRef.value?.resetForm();
  }
}
</script>
