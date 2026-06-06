<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Tambah Produk Baru</h2>

    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2"
    >
      <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
      <span>{{ error }}</span>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Nama Produk</label
        >
        <input
          v-model="form.name"
          type="text"
          placeholder="Contoh: Laptop Gaming ASUS"
          class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          :class="
            formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
          "
        />
        <p
          v-if="formErrors.name"
          class="mt-1 text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle class="w-3 h-3" /> {{ formErrors.name }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Deskripsi</label
        >
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Jelaskan produk secara singkat..."
          class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          :class="
            formErrors.description
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300'
          "
        />
        <p
          v-if="formErrors.description"
          class="mt-1 text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle class="w-3 h-3" /> {{ formErrors.description }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Harga (IDR)</label
        >
        <div class="relative">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium"
            >Rp</span
          >
          <input
            v-model="form.price"
            type="number"
            min="0"
            placeholder="0"
            class="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            :class="
              formErrors.price ? 'border-red-400 bg-red-50' : 'border-gray-300'
            "
          />
        </div>
        <p
          v-if="formErrors.price"
          class="mt-1 text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle class="w-3 h-3" /> {{ formErrors.price }}
        </p>
      </div>

      <button
        @click="handleSubmit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <PlusCircle v-else class="w-4 h-4" />
        {{ isLoading ? "Menyimpan..." : "Tambah Produk" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, PlusCircle, Loader2 } from "lucide-vue-next";
import type { CreateProductPayload } from "~/types/product";

defineProps<{
  isLoading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  submit: [payload: CreateProductPayload];
}>();

const form = reactive({
  name: "",
  description: "",
  price: null as number | null,
});

const formErrors = reactive({
  name: "",
  description: "",
  price: "",
});

function validateForm(): boolean {
  formErrors.name = "";
  formErrors.description = "";
  formErrors.price = "";

  let isValid = true;

  if (!form.name.trim()) {
    formErrors.name = "Nama produk wajib diisi";
    isValid = false;
  }
  if (!form.description.trim()) {
    formErrors.description = "Deskripsi wajib diisi";
    isValid = false;
  }
  if (form.price === null || form.price < 0) {
    formErrors.price = "Harga wajib diisi dan tidak boleh negatif";
    isValid = false;
  }

  return isValid;
}

function handleSubmit() {
  if (!validateForm()) return;
  emit("submit", {
    name: form.name.trim(),
    description: form.description.trim(),
    price: form.price!,
  });
}

function resetForm() {
  form.name = "";
  form.description = "";
  form.price = null;
  formErrors.name = "";
  formErrors.description = "";
  formErrors.price = "";
}

defineExpose({ resetForm });
</script>
