import type { Category } from '../stores/category.store';
import { supabase } from './supabase';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 