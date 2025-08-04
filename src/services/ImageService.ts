import { ImageService } from '@/types/services';

export class BrowserImageService implements ImageService {
  base64ToImage(base64String: string): string {
    // If the base64 string already has a data URL prefix, return as is
    if (base64String.startsWith('data:')) {
      return base64String;
    }
    
    // Try to determine the image type from the base64 string
    // This is a simple heuristic - in a real app you might want to be more sophisticated
    let mimeType = 'image/png'; // default
    
    try {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Check for common image signatures
      if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
        mimeType = 'image/jpeg';
      } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        mimeType = 'image/png';
      } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        mimeType = 'image/gif';
      } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
        mimeType = 'image/webp';
      }
    } catch (error) {
      throw new Error('Invalid Base64 string');
    }
    
    return `data:${mimeType};base64,${base64String}`;
  }

  async imageToBase64(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(imageFile);
    });
  }
}
