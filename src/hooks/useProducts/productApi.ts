
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";
import { CarouselConfig } from "@/types/specialSections"; // Import CarouselConfig type

// Helper function to fetch tags for a list of products
const fetchTagsForProducts = async (productsData: Omit<Product, "tags">[]): Promise<Product[]> => {
  if (!productsData || productsData.length === 0) {
    return [];
  }

  const productIds = productsData.map((p) => p.id);

  // Fetch all relevant tags in one go using the view
  const { data: productTagsData, error: tagsError } = await supabase
    .from("view_product_with_tags")
    .select("product_id, tag_id, tag_name")
    .in("product_id", productIds);

  if (tagsError) {
    console.error("Erro ao buscar tags para produtos:", tagsError);
    // Return products without tags if tag fetching fails
    return productsData.map((p) => ({ ...p, tags: [] }));
  }

  // Map tags to each product
  const productsWithTags = productsData.map((product) => {
    const tags = 
      productTagsData
        ?.filter((row) => row.product_id === product.id)
        .map((row) => ({ id: row.tag_id, name: row.tag_name }))
        .filter((tag): tag is { id: string; name: string } => !!tag.id && !!tag.name) || []; // Type guard
    return {
      ...product,
      tags,
    };
  });

  return productsWithTags;
};

export const fetchProductsFromDatabase = async (): Promise<Product[]> => {
  console.log("Buscando todos os produtos ativos...");

  // Fetch all active products
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true) // Only active products
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Erro ao buscar produtos:", productsError);
    throw productsError;
  }

  console.log("Produtos base encontrados:", productsData?.length || 0);

  // Fetch tags for these products
  return fetchTagsForProducts(productsData || []);
};

// New function to fetch products based on specific criteria (tags, product IDs, or combined)
export const fetchProductsByCriteria = async (config: CarouselConfig): Promise<Product[]> => {
  console.log("Buscando produtos por critério:", config);
  const { selection_mode, tag_ids = [], product_ids = [] } = config;

  let query = supabase.from("products").select("*, product_tags!inner(tag_id)").eq("is_active", true);

  let finalProductIds: string[] = [];

  // --- Logic based on selection_mode --- 

  if (selection_mode === "tags" && tag_ids.length > 0) {
    // Fetch products that have ANY of the specified tags
    const { data: productsWithMatchingTags, error: tagQueryError } = await supabase
      .from("products")
      .select("id")
      .eq("is_active", true)
      .filter("id", "in", `(select product_id from product_tags where tag_id in (${tag_ids.map(id => `\"${id}\"`).join(",")}))`); // Subquery to find products with matching tags
      
    if (tagQueryError) {
        console.error("Erro ao buscar produtos por tags:", tagQueryError);
        throw tagQueryError;
    }
    finalProductIds = productsWithMatchingTags?.map(p => p.id) || [];

  } else if (selection_mode === "products" && product_ids.length > 0) {
    // Use the provided product IDs directly
    finalProductIds = product_ids;

  } else if (selection_mode === "combined" && (tag_ids.length > 0 || product_ids.length > 0)) {
    // Fetch products matching tags
    let productsFromTags: string[] = [];
    if (tag_ids.length > 0) {
        const { data: productsWithMatchingTags, error: tagQueryError } = await supabase
          .from("products")
          .select("id")
          .eq("is_active", true)
          .filter("id", "in", `(select product_id from product_tags where tag_id in (${tag_ids.map(id => `\"${id}\"`).join(",")}))`);
        
        if (tagQueryError) {
            console.error("Erro ao buscar produtos por tags (combinado):", tagQueryError);
            // Continue without tag results if error occurs
        } else {
            productsFromTags = productsWithMatchingTags?.map(p => p.id) || [];
        }
    }
    // Combine with specific product IDs, removing duplicates
    finalProductIds = [...new Set([...productsFromTags, ...product_ids])];

  } else {
    // No criteria or empty lists, return empty array
    console.log("Nenhum critério válido fornecido (tags/produtos vazios ou modo inválido).");
    return [];
  }

  // --- Fetch full product data for the final list of IDs --- 
  if (finalProductIds.length === 0) {
    console.log("Nenhum ID de produto corresponde aos critérios.");
    return [];
  }

  console.log(`Buscando dados completos para ${finalProductIds.length} produtos.`);
  const { data: productsData, error: finalFetchError } = await supabase
    .from("products")
    .select("*")
    .in("id", finalProductIds)
    .eq("is_active", true); // Ensure they are still active

  if (finalFetchError) {
    console.error("Erro ao buscar dados finais dos produtos:", finalFetchError);
    throw finalFetchError;
  }

  // Fetch tags for the final list of products
  return fetchTagsForProducts(productsData || []);
};


export const addProductToDatabase = async (productData: Omit<Product, "id" | "tags"> & { tagIds: string[] }) => {
  console.log("Adicionando produto:", productData);
  const { tagIds, ...product } = productData;

  const { data: productResult, error: productError } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (productError) {
    console.error("Erro ao inserir produto:", productError);
    throw productError;
  }

  console.log("Produto criado:", productResult.id);

  // Adicionar relacionamentos com tags
  if (tagIds && tagIds.length > 0) {
    console.log("Adicionando tags ao produto:", tagIds);
    const tagRelations = tagIds.map((tagId) => ({
      product_id: productResult.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase.from("product_tags").insert(tagRelations);

    if (tagError) {
      console.error("Erro ao adicionar tags:", tagError);
      // Decide if you want to throw or just log the error
      // throw tagError;
    }
    console.log("Tags adicionadas com sucesso");
  }

  return productResult;
};

export const updateProductInDatabase = async (id: string, updates: Partial<Product> & { tagIds?: string[] }) => {
  console.log("Atualizando produto:", id, updates);
  const { tagIds, tags, ...productUpdates } = updates; // Exclude tags from direct update

  const { data, error } = await supabase
    .from("products")
    .update(productUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }

  console.log("Produto atualizado:", data.id);

  // Atualizar tags se fornecidas (tagIds is the source of truth)
  if (tagIds !== undefined) {
    console.log("Atualizando tags do produto:", tagIds);

    // Remover relacionamentos existentes
    const { error: deleteError } = await supabase.from("product_tags").delete().eq("product_id", id);

    if (deleteError) {
      console.error("Erro ao remover tags antigas:", deleteError);
      // Decide whether to throw or continue
      // throw deleteError;
    }

    // Adicionar novos relacionamentos
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map((tagId) => ({
        product_id: id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase.from("product_tags").insert(tagRelations);

      if (tagError) {
        console.error("Erro ao inserir novas tags:", tagError);
        // Decide whether to throw or continue
        // throw tagError;
      }
    }
    console.log("Tags atualizadas com sucesso");
  }

  return data;
};

export const deleteProductFromDatabase = async (id: string) => {
  console.log("Deletando produto:", id);

  // Need to delete from product_tags first due to potential foreign key constraints
  const { error: tagDeleteError } = await supabase.from("product_tags").delete().eq("product_id", id);
  if (tagDeleteError) {
     console.error("Erro ao deletar tags associadas ao produto:", tagDeleteError);
     // Decide if you want to stop or continue
     // throw tagDeleteError;
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }

  console.log("Produto deletado com sucesso");
};

