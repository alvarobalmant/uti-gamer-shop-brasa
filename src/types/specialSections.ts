import { Database } from "./supabase/types";

// Base type for Special Section from the database
export type SpecialSection = Database["public"]["Tables"]["special_sections"]["Row"];

// Base type for Special Section Element from the database
export type SpecialSectionElement = Database["public"]["Tables"]["special_section_elements"]["Row"];

// Base type for Special Section Grid Layout from the database
export type SpecialSectionGridLayout = Database["public"]["Tables"]["special_section_grid_layouts"]["Row"];

// Input type for creating a new Special Section (excluding auto-generated fields)
export type SpecialSectionCreateInput = Omit<
  SpecialSection,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section (all fields optional)
export type SpecialSectionUpdateInput = Partial<SpecialSectionCreateInput>;

// Input type for creating a new Special Section Element
export type SpecialSectionElementCreateInput = Omit<
  SpecialSectionElement,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section Element
export type SpecialSectionElementUpdateInput = Partial<SpecialSectionElementCreateInput>;

// Input type for creating a new Special Section Grid Layout
export type SpecialSectionGridLayoutCreateInput = Omit<
  SpecialSectionGridLayout,
  "id" | "created_at" | "updated_at"
>;

// Input type for updating an existing Special Section Grid Layout
export type SpecialSectionGridLayoutUpdateInput = Partial<SpecialSectionGridLayoutCreateInput>;

