import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
      if (formData.has("expiryDate")) {
        baseData.expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
      }
      if (formData.has("weightGrams")) {
        baseData.weightGrams = formData.get("weightGrams") ? parseInt(formData.get("weightGrams") as string) : null;
      }

      // Dynamically map Pakistan fields if present
      if (formData.has("voltage")) {
        baseData.voltage = formData.get("voltage") as string;
      }
      if (formData.has("warrantyMonths")) {
        baseData.warrantyMonths = formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths") as string) : null;
      }

      await productService.createProduct(baseData);
      revalidatePath("/products");
      redirect("/products");
    },

    async updateProduct(id: string, formData: FormData) {
      const baseData: Record<string, any> = {
        name: formData.get("name") as string,
        price: parseFloat(formData.get("price") as string),
        stock: parseInt(formData.get("stock") as string),
        category: formData.get("category") as string,
      };

      if (formData.has("expiryDate")) {
        baseData.expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
      }
      if (formData.has("weightGrams")) {
        baseData.weightGrams = formData.get("weightGrams") ? parseInt(formData.get("weightGrams") as string) : null;
      }
      if (formData.has("voltage")) {
        baseData.voltage = formData.get("voltage") as string;
      }
      if (formData.has("warrantyMonths")) {
        baseData.warrantyMonths = formData.get("warrantyMonths") ? parseInt(formData.get("warrantyMonths") as string) : null;
      }

      await productService.updateProduct(id, baseData);
      revalidatePath("/products");
      redirect("/products");
    },

    async deleteProduct(id: string) {
      await productService.deleteProduct(id);
      revalidatePath("/products");
    }
  };
}
