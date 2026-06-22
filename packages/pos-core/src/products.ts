import { revalidatePath } from "next/cache";

// Factory function accepting your custom database service instance
export function createProductActions(productService: any) {
  return {
    async getProducts() {
      return productService.getProducts();
    },

    async getProductById(id: string) {
      return productService.getProductById(id);
    },

    async createProduct(formData: FormData) {
      // Parse base variables shared by both stores
      const baseData: Record<string, any> = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
      };

      // Dynamically map Dubai fields if present
      if (formData.has("sku")) {
        const sku = formData.get("sku") as string;
        baseData.sku = sku.trim() ? sku.trim() : null;
      }
      if (formData.has("unitOfMeasure")) {
        const unit = formData.get("unitOfMeasure") as string;
        baseData.unitOfMeasure = unit ? unit : null;
      }
      if (formData.has("unitQuantity")) {
        const qty = formData.get("unitQuantity") as string;
        baseData.unitQuantity = qty ? parseFloat(qty) : null;
      }
      if (formData.has("expiryDate")) {
        baseData.expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
      }
      if (formData.has("weightGrams")) {
        baseData.weightGrams = formData.get("weightGrams") ? parseInt(formData.get("weightGrams") as string) : null;
      }

      // Dynamically map Pakistan fields if present
      if (formData.has("brand")) {
        const brand = formData.get("brand") as string;
        baseData.brand = brand.trim() ? brand.trim() : null;
      }
      if (formData.has("modelNumber")) {
        const model = formData.get("modelNumber") as string;
        baseData.modelNumber = model.trim() ? model.trim() : null;
      }
      if (formData.has("serialNumber")) {
        const serial = formData.get("serialNumber") as string;
        baseData.serialNumber = serial.trim() ? serial.trim() : null;
      }
      if (formData.has("voltage")) {
        const voltage = formData.get("voltage") as string;
        baseData.voltage = voltage.trim() ? voltage.trim() : null;
      }
      if (formData.has("warrantyMonths")) {
        baseData.warrantyMonths = formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths") as string) : null;
      }

      await productService.createProduct(baseData);
      revalidatePath("/products");
    },

    async updateProduct(id: string, formData: FormData) {
      const baseData: Record<string, any> = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
      };

      if (formData.has("sku")) {
        const sku = formData.get("sku") as string;
        baseData.sku = sku.trim() ? sku.trim() : null;
      }
      if (formData.has("unitOfMeasure")) {
        const unit = formData.get("unitOfMeasure") as string;
        baseData.unitOfMeasure = unit ? unit : null;
      }
      if (formData.has("unitQuantity")) {
        const qty = formData.get("unitQuantity") as string;
        baseData.unitQuantity = qty ? parseFloat(qty) : null;
      }
      if (formData.has("expiryDate")) {
        baseData.expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
      }
      if (formData.has("weightGrams")) {
        baseData.weightGrams = formData.get("weightGrams") ? parseInt(formData.get("weightGrams") as string) : null;
      }
      if (formData.has("brand")) {
        const brand = formData.get("brand") as string;
        baseData.brand = brand.trim() ? brand.trim() : null;
      }
      if (formData.has("modelNumber")) {
        const model = formData.get("modelNumber") as string;
        baseData.modelNumber = model.trim() ? model.trim() : null;
      }
      if (formData.has("serialNumber")) {
        const serial = formData.get("serialNumber") as string;
        baseData.serialNumber = serial.trim() ? serial.trim() : null;
      }
      if (formData.has("voltage")) {
        const voltage = formData.get("voltage") as string;
        baseData.voltage = voltage.trim() ? voltage.trim() : null;
      }
      if (formData.has("warrantyMonths")) {
        baseData.warrantyMonths = formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths") as string) : null;
      }

      await productService.updateProduct(id, baseData);
      revalidatePath("/products");
    },

    async deleteProduct(id: string) {
      await productService.deleteProduct(id);
      revalidatePath("/products");
    }
  };
}
