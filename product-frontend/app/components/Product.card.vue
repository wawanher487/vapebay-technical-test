<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
  >
    <div class="flex justify-between items-start gap-3">
      <div class="flex items-start gap-2 min-w-0">
        <Package class="w-4 h-4 text-blue-400 mt-1 shrink-0" />
        <h3 class="font-semibold text-gray-800 leading-tight truncate">
          {{ product.name }}
        </h3>
      </div>
      <span
        class="shrink-0 font-bold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-lg"
      >
        {{ formatPrice(product.price) }}
      </span>
    </div>
    <p class="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2 pl-6">
      {{ product.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Package } from "lucide-vue-next";
import type { Product } from "~/types/product";

defineProps<{
  product: Product;
}>();

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
</script>
