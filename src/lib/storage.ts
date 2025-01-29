import { supabase } from './supabase';

export const uploadUserPhoto = async (file: File, userId: string): Promise<string> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('user_photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user_photos')
      .getPublicUrl(data.path);

    // Update user metadata with the new photo URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: { photo_url: publicUrl }
    });

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const deleteUserPhoto = async (userId: string, photoUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const path = photoUrl.split('/').slice(-2).join('/');
    
    // Delete file from storage
    const { error } = await supabase.storage
      .from('user_photos')
      .remove([path]);

    if (error) throw error;

    // Update user metadata to remove photo URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: { photo_url: null }
    });

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};
